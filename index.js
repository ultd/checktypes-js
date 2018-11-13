/**
 * Check if the passed item is correct type, returning
 * in 1st item an Array of errors if exist or null if not
 * and 2nd item the passed item itself. If using callback style, returns
 * function with errors Array and passed item as arguments 1 & 2.
 *
 * Examples:
 *
 *     // Check a primitive type
 *     checkTypes(66, Number)
 *
 *     // Check an Array type
 *     checkTypes(['john', 'adam', 'ahmad', 'sheila'], Array)
 *
 *     // Check an Array type with also checking element types
 *     checkTypes([55, 105, 33, -44], [Number])
 *
 *     // Check an Object type
 *     cehckTypes({name: 'John', age: '44'}, Object)
 *
 *     // Check an Object type with a schema
 *     checkTypes({name: 'John', age: 44}, {name: String, age: Number})
 *
 *     // Check an object type with a schema with required fields using $required
 *     checkTypes({username: 'briana1000', password: 'apassWord!'},
 *                {username: String, password: String, $required: ['username', 'password']})
 *
 * @param {String|Array|Object|Boolean|Number|Symbol} passed
 * @param {String|Array|Object|Boolean|Number|Symbol|{}|[]|} schema
 * @param {Function} cb
 * @return {[[errors], (passed type)]}
 * @public
 */

function checkTypes(passed, schema, cb) {
	let callback = false
	if (typeof cb === 'function') callback = true
	// If no schema provided, skip checkTypes & return passed
	if (!schema) return callback ? cb(null, passed) : [null, passed]

	// Initialize validation errorsArray array
	const errorsArray = []
	let error

	// Helper function to check the type of the element passed | ex: {name: 'john'} to 'Object'
	function getType(elem) {
		const retType = Object.prototype.toString.call(elem).slice(8, -1)
		if (retType === 'Undefined') return 'None'
		else if (retType === 'Null') return 'None'
		else return retType
	}

	// Helper function to convert schema definition types to string properly | ex: Object to 'Object'
	function schemaTypeToString(elem) {
		try {
			if (getType(elem) === 'Object') return 'Object'
			if (getType(elem) === 'Array') return 'Array'
			const retType = elem.toString().substring(9, elem.toString().indexOf('('))
			if (retType === 'Undefined') return 'None'
			else return retType
		} catch (e) {
			if (e instanceof TypeError) return 'None'
		}
	}
	let returnItem

	const passedType = getType(passed)
	const schemaType = schemaTypeToString(schema)

	if (passedType !== schemaType) {
		error = [
			{
				propertyName: '',
				expectedType: schemaType,
				receivedType: passedType,
				required: true
			}
		]

		returnItem = passed
		return callback ? cb(error, returnItem) : [error, returnItem]
	}

	if (passedType === 'Object') {
		returnItem = checkObjectIsValid(schema === Object ? {} : schema, passed)
	} else if (passedType === 'Array') {
		returnItem = checkArrayIsValid(schema === Array ? [] : schema, passed)
	} else {
		returnItem = passed
	}

	/*
        If errorsArray exist in returnItem (meaning a mismatch between schema and returnItem),
        return errorsArray and returnItem
    */
	if (errorsArray.length > 0)
		return callback ? cb(errorsArray, returnItem) : [errorsArray, returnItem]
	/*
        If no errorsArray found in returnItem, return null and passThrough object.
    */ else
		return callback ? cb(null, returnItem) : [null, returnItem]

	/*
        Schema Example:    {name: String, age: Number, $required: ['name']} 

        -- Required Settings --
        A. [(property), (property), ...] :  requires property names listed.
        B. $required(){ } :                 requires all properties in that level schema

        -- Use Cases --
        ex1: {name: String, age: Number, $required: []} : 
             {name: 'John', age: 33, $required: ['name']} : {name: (required), age: (not required)}

        ex2: {name: String, age: Number, $required: function()} : 
             {name: 'John', age: 33, $required} : {name: (required), age: (required)}

        -- Error Cases --
        ex1: {name: String, age: Number, $required: ['name']} : 
             {firstName: 'John', age: 33, $required: ['name']} : 
             {name: (required - MISSING!), firstName: (UNEXPECTED!)  age: (not required)}
             -- name is required but missing, firstName is not expected. 
    */
	function checkObjectIsValid(schemaObject, passedObject, parentName) {
		const returningObject = {}
		const objPropertyNames = Object.keys(passedObject)
		const schemaPropertyNames = Object.keys(schemaObject)
		if (!schemaPropertyNames.length) return passedObject

		if (typeof schemaObject['$required'] === 'function') {
			const schemaPropertyNamesWithoutRequired = schemaPropertyNames.filter(
				prop => prop !== '$required'
			)
			schemaObject['$required'] = schemaObject['$required'](
				schemaPropertyNamesWithoutRequired
			)
		} else if (!schemaObject['$required']) {
			schemaObject.$required = []
		}

		const $required = schemaObject['$required']

		// Return array of missing fields in passedObject according to $required field in schemaObject
		const requiredMissing = $required.filter(reqdField => {
			return !objPropertyNames.includes(reqdField)
		})

		// For each missing required field, push them to errorsArray array.
		requiredMissing.forEach(reqdMissItem => {
			// If this is a nested object, specify nested propertyName to error
			const propertyName = parentName
				? parentName + '.' + reqdMissItem
				: reqdMissItem

			// If schemaObject has expected type defined, use that otherwise it expected none.
			const expType = schemaObject[reqdMissItem]
				? schemaObject[reqdMissItem]
				: 'None'

			errorsArray.push({
				propertyName: propertyName,
				expectedType: schemaTypeToString(schemaObject[reqdMissItem]),
				receivedType: getType(passedObject[reqdMissItem]),
				required: true
			})
		})

		objPropertyNames.forEach(propName => {
			// set property name to parentName.propName if parentName was passed else set to just propName
			const propertyName = parentName ? parentName + '.' + propName : propName
			const passedObjectPropertyType = getType(passedObject[propName])
			const passedSchemaPropertyType = schemaTypeToString(schemaObject[propName])

			let required

			// set required var to true or false depending on if it's required or not
			required = schemaObject.$required.find(req => {
				return req === propName
			})

			required = required ? true : false

			// case in which a key of passedObject was not defined but required
			if (passedObjectPropertyType === 'None' && required) {
				errorsArray.push({
					propertyName: propertyName,
					expectedType: passedSchemaPropertyType,
					receivedType: passedObjectPropertyType,
					required: required
				})
			}

			// Object type validation
			else if (passedObjectPropertyType === 'Object') {
				// if passedObject property doesn't match schemaObject property type, push an error.
				if (passedSchemaPropertyType !== 'Object') {
					errorsArray.push({
						propertyName: propertyName,
						expectedType: passedSchemaPropertyType,
						receivedType: passedObjectPropertyType,
						required: required
					})
					returningObject[propName] = passedObject[propName]
				} else {
					// recursively check the passedObject property's props to match the schema definition.
					returningObject[propName] = checkObjectIsValid(
						schemaObject[propName],
						passedObject[propName],
						propertyName
					)
				}

				// Array type validation
			} else if (passedObjectPropertyType === 'Array') {
				// if passedObject property doesn't match schemaObject property type, push an error.
				if (passedSchemaPropertyType !== 'Array') {
					errorsArray.push({
						propertyName: propertyName,
						expectedType: passedSchemaPropertyType,
						receivedType: passedObjectPropertyType,
						required: required
					})
					returningObject[propName] = passedObject[propName]
				} else {
					returningObject[propName] = checkArrayIsValid(
						schemaObject[propName],
						passedObject[propName],
						propertyName
					)
				}
			} else if (
				passedObjectPropertyType !== passedSchemaPropertyType &&
				passedObjectPropertyType !== 'None'
			) {
				errorsArray.push({
					propertyName: propertyName,
					expectedType: passedSchemaPropertyType,
					receivedType: passedObjectPropertyType,
					required: required
				})
				returningObject[propName] = passedObject[propName]
			} else {
				returningObject[propName] = passedObject[propName]
			}
		})

		return returningObject
	}

	/*
        Schema Example:    [TYPE] 

        -- Use Cases --
        ex1: [String] : ['John', '44'] : [String, String]
        ex2: [] : ['John', 44] : [ANY, ANY]
        ex4: [{name: String, age: Number, $required: ['name', 'age']}] : [Object]

        -- Error Cases --
        ex1: [String] : ['John', 33] [String, ERROR - expected String]

    */
	function checkArrayIsValid(schemaArray, passedArray, parentName = '') {
		// Not valid schema or passedArray is not array
		if (schemaTypeToString(schemaArray) !== 'Array' || !Array.isArray(passedArray)) {
			throw new Error(
				'checkArrayIsValid needs both schemaArray & passedArray to be arrays.'
			)
		}

		// No schema passed just need to make sure is array.
		if (!schemaArray.length) {
			return passedArray
		} else if (typeof schemaArray === 'function') {
			return passedArray
		}

		const returnArray = []
		const schemaType = schemaTypeToString(schemaArray[0])
		passedArray.forEach((element, i) => {
			const propertyName = parentName ? parentName + '[' + i + ']' : '[' + i + ']'
			const elementType = getType(element)
			if (elementType === 'Array') {
				if (elementType !== schemaType) {
					errorsArray.push({
						propertyName: propertyName,
						expectedType: schemaType,
						receivedType: elementType,
						required: false
					})
					returnArray[i] = element
				} else {
					returnArray[i] = checkArrayIsValid(
						schemaArray[0],
						element,
						propertyName
					)
				}
			} else if (elementType === 'Object') {
				if (elementType !== schemaType) {
					errorsArray.push({
						propertyName: propertyName,
						expectedType: schemaType,
						receivedType: elementType,
						required: false
					})
					returnArray[i] = element
				} else {
					returnArray[i] = checkObjectIsValid(
						schemaArray[0],
						element,
						propertyName
					)
				}
			} else {
				if (elementType !== schemaType) {
					errorsArray.push({
						propertyName: propertyName,
						expectedType: schemaType,
						receivedType: elementType,
						required: false
					})
					returnArray[i] = element
				} else {
					returnArray[i] = element
				}
			}
		})
		return returnArray
	}
}

module.exports = checkTypes

checkTypes.$required = function(allKeys) {
	return [].concat(allKeys)
}

checkTypes.getType = function(elem) {
	return Object.prototype.toString.call(elem).slice(8, -1)
}

checkTypes.getVal = function(passedObjOrArr, accessorString, stepBack = 0) {
	function get() {
		var passedObjectOrArray = passedObjOrArr
		if (stepBack < 0) throw new Error('stepBack must be zero or greater.')
		accessorString = accessorString.replace(/\[(\w+)\]/g, '.$1')
		accessorString = accessorString.replace(/^\./, '')
		var accessorStringsSplit = accessorString.split('.')
		if (accessorStringsSplit.length - stepBack < 1)
			throw new Error('stepBack cannot be more than total properties.')
		for (var i = 0; i < accessorStringsSplit.length - stepBack; i++) {
			var val = accessorStringsSplit[i]
			if (val in passedObjectOrArray) {
				passedObjectOrArray = passedObjectOrArray[val]
			} else {
				throw new Error('Invalid accessorString passed.')
			}
		}
		return passedObjectOrArray
	}
	return get()
}

checkTypes.setVal = function(passedObject, accessorString, newValue, stepBack = 0) {
	if (stepBack < 0) throw new Error('stepBack must be zero or greater.')
	function set(path, value) {
		path = path.replace(/\[(\w+)\]/g, '.$1')
		path = path.replace(/^\./, '')
		var arrOrObj = passedObject
		var pathList = path.split('.')
		var len = pathList.length - stepBack
		if (pathList.length - stepBack < 1)
			throw new Error('stepBack cannot be more than total properties.')
		for (var i = 0; i < len - 1; i++) {
			var elem = pathList[i]
			if (!arrOrObj[elem]) {
				throw new Error('Invalid accessorString passed.')
			} else {
				arrOrObj = arrOrObj[elem]
			}
		}
		arrOrObj[pathList[len - 1]] = value
		return arrOrObj[pathList[len - 1]]
	}
	return set(accessorString, newValue)
}

checkTypes.propsFromString = function(accessorString) {
	if (!accessorString.length) return []
	accessorString = accessorString.replace(/\[(\w+)\]/g, '.$1')
	accessorString = accessorString.replace(/^\./, '')
	const accessorStringList = accessorString.split('.')
	return accessorStringList
}

checkTypes.typeToString = function(elem) {
	if (elem === undefined) return 'Undefined'
	if (elem === null) return 'Null'
	return elem.toString().substring(9, elem.toString().indexOf('('))
}

checkTypes.stringToType = function(typeString) {
	if (typeof typeString !== 'string') throw new Error('argument must be a string type.')
	const typeStringsSupport = [
		'String',
		'Array',
		'Object',
		'Number',
		'Boolean',
		'Symbol',
		'Null',
		'Undefined'
	]

	const supported = typeStringsSupport.filter(
		supportedType => supportedType === typeString
	)
	if (!supported.length) throw new Error('Not a supported type.')
	if (typeString === 'String') return String
	else if (typeString === 'Array') return Array
	else if (typeString === 'Object') return Object
	else if (typeString === 'Number') return Number
	else if (typeString === 'Boolean') return Boolean
	else if (typeString === 'Symbol') return Symbol
	else if (typeString === 'Undefined') return undefined
	else if (typeString === 'Null') return null
	else throw new Error("Couldn't return correct type for unknown reason.")
}
