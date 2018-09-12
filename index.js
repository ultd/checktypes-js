

/**
 * Check if the passed item is correct type, returning
 * an array with element 0 an Array of errors if exist or null
 * and element 1 the passed item. If using call back returns 
 * function with errors Array and passed item as arguments 1 & 2
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
 * @param {String|Array|Object|Boolean|Number} passed
 * @param {String|Array|Object|Boolean|Number|{}|[]} schema
 * @param {Function} cb
 * @return {[[errors], (passed type)]}
 * @public
 */

function checkTypes(passed, schema, cb){

    let callback = false
    if(typeof cb === 'function')
        callback = true
    // If no schema provided, skip checkTypes & return passed
    if(!schema) 
        return callback ? cb(null, passed) : [null, passed]


    // Initialize validation errorsArray array
    const errorsArray = []
    let error

    // Helper function to check the type of the element passed | ex: {name: 'john'} to 'Object'
    function getType(elem) 
    {
        const retType = Object.prototype.toString.call(elem).slice(8, -1)
        if(retType === 'Undefined')
            return 'None'
        else if(retType === 'Null')
            return 'None'
        else
            return retType
    }

    // Helper function to convert schema definition types to string properly | ex: Object to 'Object'
    function schemaTypeToString (elem)
    {
        try {
            if(getType(elem) === 'Object')
                return 'Object'
            if(getType(elem) === 'Array')
                return 'Array'
            const retType = elem.toString().substring(9, elem.toString().indexOf('('))
            if(retType === 'Undefined')
                return 'None'
            else
                return retType
        } catch(e) {
            if(e instanceof TypeError)
            return 'None'
        }
    }
    let returnItem

    const passedType = getType(passed)
    const schemaType = schemaTypeToString(schema)

    if(passedType !== schemaType)
    {

        error = {
            expectedType: schemaType,
            recievedType: passedType,
            required: true
        }
            
        returnItem = passed
        return callback ? cb(error, returnItem) : [error, returnItem]
    }

    if(passedType === 'Object')
    {
        returnItem = checkObjectIsValid(schema === Object ? {} : schema, passed)
    }
    else if(passedType === 'Array')
    {
        returnItem = checkArrayIsValid(schema === Array ? [] : schema, passed)
    }
    else
    {
        returnItem = passed
    }
    
    /*
        If errorsArray exist in returnItem (meaning a mismatch between schema and returnItem),
        return errorsArray and returnItem
    */
    if(errorsArray.length > 0)
        return callback ? cb(errorsArray, returnItem) : [errorsArray, returnItem] 
    /*
        If no errorsArray found in returnItem, return null and passThrough object.
    */
    else
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
    function checkObjectIsValid(schemaObject, passedObject, parentName)
    {
        const returningObject = {}
        const objPropertyNames = Object.keys(passedObject)
        const schemaPropertyNames = Object.keys(schemaObject)
        if(!schemaPropertyNames.length)
            return passedObject

        if(typeof schemaObject['$required'] === 'function')
        {

            schemaObject['$required'] = schemaObject['$required'](schemaPropertyNames)
        }

        // Check to see if $required key is defined in schema, if not set to empty array
        if(!schemaObject['$required'])
        {
            schemaObject.$required = []
        }
    
        const $required = schemaObject['$required']

        // Return array of missing fields in passedObject according to $required field in schemaObject
        const requiredMissing = $required.filter((reqdField)=>{
            return !objPropertyNames.includes(reqdField)
        })

        // For each missing required field, push them to errorsArray array.
        requiredMissing.forEach(reqdMissItem => {

            // If this is a nested object, specify nested propertyName to error
            const propertyName = parentName ? parentName + '.' + reqdMissItem : reqdMissItem

            // If schemaObject has expected type defined, use that otherwise it expected none.
            const expType = schemaObject[reqdMissItem] ? schemaObject[reqdMissItem] : 'None'

            errorsArray.push({
                propertyName: propertyName,
                expectedType: schemaTypeToString(schemaObject[reqdMissItem]),
                recievedType: getType(passedObject[reqdMissItem]),
                required: true
            })
        })

        objPropertyNames.forEach( propName => {

            // set property name to parentName.propName if parentName was passed else set to just propName
            const propertyName = parentName ? parentName + '.' + propName : propName
            const passedObjectPropertyType = getType(passedObject[propName])
            const passedSchemaPropertyType = schemaTypeToString(schemaObject[propName])

            let required

            // set required var to true or false depending on if it's required or not 
            required = schemaObject.$required.find((req)=>{
                return req === propName
            })

            required = required ? true : false

            // case in which a key of passedObject was not defined but required
            if(passedObjectPropertyType === 'None' && required)
            {
                errorsArray.push({
                    propertyName: propertyName,
                    expectedType: passedSchemaPropertyType,
                    recievedType: passedObjectPropertyType,
                    required: required
                })
            } 

            // Object type validation
            else if(passedObjectPropertyType === 'Object')
            {

                // if passedObject property doesn't match schemaObject property type, push an error.
                if(passedSchemaPropertyType !== 'Object')
                {
                    errorsArray.push({
                        propertyName: propertyName,
                        expectedType: passedSchemaPropertyType,
                        recievedType: passedObjectPropertyType,
                        required: required
                    })
                    returningObject[propName] = passedObject[propName]
                } 
                else 
                {
                    // recursively check the passedObject property's props to match the schema definition.
                    returningObject[propName] = checkObjectIsValid(schemaObject[propName], passedObject[propName], propertyName)
                }

            // Array type validation
            } 
            else if(passedObjectPropertyType === 'Array')
            {
                // if passedObject property doesn't match schemaObject property type, push an error.
                if(passedSchemaPropertyType !== 'Array')
                {
                    errorsArray.push({
                        propertyName: propertyName,
                        expectedType: passedSchemaPropertyType,
                        recievedType: passedObjectPropertyType,
                        required: required
                    })
                    returningObject[propName] = passedObject[propName]
                } 
                else 
                {
                    returningObject[propName] = checkArrayIsValid(schemaObject[propName], passedObject[propName], propertyName)
                }
            }
            else if(passedObjectPropertyType !== passedSchemaPropertyType)
            {
                errorsArray.push({
                    propertyName: propertyName,
                    expectedType: passedSchemaPropertyType,
                    recievedType: passedObjectPropertyType,
                    required: required
                })
                returningObject[propName] = passedObject[propName]
            } 
            else 
            {
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
    function checkArrayIsValid(schemaArray, passedArray, parentName = '')
    {
        // Not valid schema or passedArray is not array
        if(!Array.isArray(schemaArray) || !Array.isArray(passedArray))
        {
            throw new Error('checkArrayIsValid needs both schemaArray & passedArray to be arrays.')
        }

        // No schema passed just need to make sure is array.
        if(!schemaArray.length)
        {
            return passedArray
        }

        const returnArray = []
        const schemaType = schemaTypeToString(schemaArray[0])
        passedArray.forEach((element, i) => {
            const propertyName = parentName ? parentName + '.' + i : i
            const elementType = getType(element)
            if(elementType === 'Array')
            {
                if(elementType !== schemaType)
                {
                    errorsArray.push({
                        propertyName: propertyName,
                        expectedType: schemaType,
                        recievedType: elementType,
                        required: null
                    })
                    returnArray[i] = element
                }
                else 
                {
                    returnArray[i] = checkArrayIsValid(schemaArray[0], element, propertyName)
                }
            }
            else if (elementType === 'Object')
            {
                if(elementType !== schemaType)
                {
                    errorsArray.push({
                        propertyName: propertyName,
                        expectedType: schemaType,
                        recievedType: elementType,
                        required: null
                    })
                    returnArray[i] = element
                }
                else 
                {
                    returnArray[i] = checkObjectIsValid(schemaArray[0], element, propertyName)
                }
            }
            else
            {
                if(elementType !== schemaType)
                {
                    errorsArray.push({
                        propertyName: propertyName,
                        expectedType: schemaType,
                        recievedType: elementType,
                        required: null
                    })
                    returnArray[i] = element
                }
                else
                {
                    returnArray[i] = element
                }
            }
        })
        return returnArray
    }

}


module.exports = checkTypes

checkTypes.$required = function (allKeys)
{
    return [].concat(allKeys)
}

checkTypes.getType = function (elem) 
{
    return Object.prototype.toString.call(elem).slice(8, -1)
}

checkTypes.getVal = function (originalObject, accessorString)
{
    const aSA = []
    const _aSA = accessorString.split('.')
    if(_aSA > 10) throw new Error('getVal() can only access 10 properties or less deep.')
    _aSA.forEach(function(n) {
        if(!n) null
        else if(new RegExp('^[0-9]+$').test(n)) return aSA.push(parseInt(n))
        else return aSA.push(n)
    })
    if(aSA.length > 20)
        throw new Error('only able to get object value 20 properties or less deep.')
    if(aSA.length === 1)
    {
        return originalObject[aSA[0]]
    }
    else if(aSA.length === 2)
    {
        return originalObject[aSA[0]][aSA[1]]
    }
    else if(aSA.length === 3)
    {
        return originalObject[aSA[0]][aSA[1]][aSA[2]]
    }
    else if(aSA.length === 4)
    {
        return originalObject[aSA[0]][aSA[1]][aSA[2]][aSA[3]]
    }
    else if(aSA.length === 5)
    {
        return originalObject[aSA[0]][aSA[1]][aSA[2]][aSA[3]][aSA[5]]
    }
    else if(aSA.length === 6)
    {
        return originalObject[aSA[0]][aSA[1]][aSA[2]][aSA[3]][aSA[5]][aSA[6]]
    }
    else if(aSA.length === 7)
    {
        return originalObject[aSA[0]][aSA[1]][aSA[2]][aSA[3]][aSA[5]][aSA[6]][aSA[7]]
    }
    else if(aSA.length === 8)
    {
        return originalObject[aSA[0]][aSA[1]][aSA[2]][aSA[3]][aSA[5]][aSA[6]][aSA[7]]
        [aSA[8]]
    }
    else if(aSA.length === 9)
    {
        return originalObject[aSA[0]][aSA[1]][aSA[2]][aSA[3]][aSA[5]][aSA[6]][aSA[7]]
        [aSA[8]][aSA[9]]
    }
    else if(aSA.length === 10)
    {
        return originalObject[aSA[0]][aSA[1]][aSA[2]][aSA[3]][aSA[5]][aSA[6]][aSA[7]]
        [aSA[8]][aSA[9]][aSA[10]]
    }
    else if(aSA.length === 11)
    {
        return originalObject[aSA[0]][aSA[1]][aSA[2]][aSA[3]][aSA[5]][aSA[6]][aSA[7]]
        [aSA[8]][aSA[9]][aSA[10]][aSA[11]]
    }
    else if(aSA.length === 12)
    {
        return originalObject[aSA[0]][aSA[1]][aSA[2]][aSA[3]][aSA[5]][aSA[6]][aSA[7]]
        [aSA[8]][aSA[9]][aSA[10]][aSA[11]][aSA[12]]
    }
    else if(aSA.length === 13)
    {
        return originalObject[aSA[0]][aSA[1]][aSA[2]][aSA[3]][aSA[5]][aSA[6]][aSA[7]]
        [aSA[8]][aSA[9]][aSA[10]][aSA[11]][aSA[12]][aSA[13]]
    }
    else if(aSA.length === 14)
    {
        return originalObject[aSA[0]][aSA[1]][aSA[2]][aSA[3]][aSA[5]][aSA[6]][aSA[7]]
        [aSA[8]][aSA[9]][aSA[10]][aSA[11]][aSA[12]][aSA[13]][aSA[14]]
    }
    else if(aSA.length === 15)
    {
        return originalObject[aSA[0]][aSA[1]][aSA[2]][aSA[3]][aSA[5]][aSA[6]][aSA[7]]
        [aSA[8]][aSA[9]][aSA[10]][aSA[11]][aSA[12]][aSA[13]][aSA[14]][aSA[15]]
    }
    else if(aSA.length === 16)
    {
        return originalObject[aSA[0]][aSA[1]][aSA[2]][aSA[3]][aSA[5]][aSA[6]][aSA[7]]
        [aSA[8]][aSA[9]][aSA[10]][aSA[11]][aSA[12]][aSA[13]][aSA[14]][aSA[15]][aSA[16]]
    }
    else if(aSA.length === 17)
    {
        return originalObject[aSA[0]][aSA[1]][aSA[2]][aSA[3]][aSA[5]][aSA[6]][aSA[7]]
        [aSA[8]][aSA[9]][aSA[10]][aSA[11]][aSA[12]][aSA[13]][aSA[14]][aSA[15]][aSA[16]]
        [aSA[17]]
    }
    else if(aSA.length === 18)
    {
        return originalObject[aSA[0]][aSA[1]][aSA[2]][aSA[3]][aSA[5]][aSA[6]][aSA[7]]
        [aSA[8]][aSA[9]][aSA[10]][aSA[11]][aSA[12]][aSA[13]][aSA[14]][aSA[15]][aSA[16]]
        [aSA[17]][aSA[18]]
    }
    else if(aSA.length === 19)
    {
        return originalObject[aSA[0]][aSA[1]][aSA[2]][aSA[3]][aSA[5]][aSA[6]][aSA[7]]
        [aSA[8]][aSA[9]][aSA[10]][aSA[11]][aSA[12]][aSA[13]][aSA[14]][aSA[15]][aSA[16]]
        [aSA[17]][aSA[18]][aSA[19]]
    }
    else if(aSA.length === 20)
    {
        return originalObject[aSA[0]][aSA[1]][aSA[2]][aSA[3]][aSA[5]][aSA[6]][aSA[7]]
        [aSA[8]][aSA[9]][aSA[10]][aSA[11]][aSA[12]][aSA[13]][aSA[14]][aSA[15]][aSA[16]]
        [aSA[17]][aSA[18]][aSA[19]][aSA[20]]
    }
    else
    {
        throw new Error('Critical error!')
    }
}

checkTypes.setVal = function(originalObject, accessorString, newValue)
{
    const aSA = []
    const _aSA = accessorString.split('.')
    if(_aSA > 10) throw new Error('setVal() can only access 10 properties or less deep.')
    _aSA.forEach(function(n) {
        if(!n) null
        else if(new RegExp('^[0-9]+$').test(n)) return aSA.push(parseInt(n))
        else return aSA.push(n)
    })
    if(aSA.length > 20)
        throw new Error('only able to get object value 20 properties or less deep.')
    if(aSA.length === 1)
    {
        return originalObject[aSA[0]] = newValue
    }
    else if(aSA.length === 2)
    {
        return originalObject[aSA[0]][aSA[1]] = newValue
    }
    else if(aSA.length === 3)
    {
        return originalObject[aSA[0]][aSA[1]][aSA[2]] = newValue
    }
    else if(aSA.length === 4)
    {
        return originalObject[aSA[0]][aSA[1]][aSA[2]][aSA[3]] = newValue
    }
    else if(aSA.length === 5)
    {
        return originalObject[aSA[0]][aSA[1]][aSA[2]][aSA[3]][aSA[5]] = newValue
    }
    else if(aSA.length === 6)
    {
        return originalObject[aSA[0]][aSA[1]][aSA[2]][aSA[3]][aSA[5]][aSA[6]] = newValue
    }
    else if(aSA.length === 7)
    {
        return originalObject[aSA[0]][aSA[1]][aSA[2]][aSA[3]][aSA[5]][aSA[6]][aSA[7]] = newValue
    }
    else if(aSA.length === 8)
    {
        return originalObject[aSA[0]][aSA[1]][aSA[2]][aSA[3]][aSA[5]][aSA[6]][aSA[7]]
        [aSA[8]] = newValue
    }
    else if(aSA.length === 9)
    {
        return originalObject[aSA[0]][aSA[1]][aSA[2]][aSA[3]][aSA[5]][aSA[6]][aSA[7]]
        [aSA[8]][aSA[9]] = newValue
    }
    else if(aSA.length === 10)
    {
        return originalObject[aSA[0]][aSA[1]][aSA[2]][aSA[3]][aSA[5]][aSA[6]][aSA[7]][aSA[8]]
        [aSA[9]][aSA[10]] = newValue
    }
    else if(aSA.length === 11)
    {
        return originalObject[aSA[0]][aSA[1]][aSA[2]][aSA[3]][aSA[5]][aSA[6]][aSA[7]][aSA[8]]
        [aSA[9]][aSA[10]][aSA[11]] = newValue
    }
    else if(aSA.length === 12)
    {
        return originalObject[aSA[0]][aSA[1]][aSA[2]][aSA[3]][aSA[5]][aSA[6]][aSA[7]][aSA[8]]
        [aSA[9]][aSA[10]][aSA[11]][aSA[12]] = newValue
    }
    else if(aSA.length === 13)
    {
        return originalObject[aSA[0]][aSA[1]][aSA[2]][aSA[3]][aSA[5]][aSA[6]][aSA[7]][aSA[8]]
        [aSA[9]][aSA[10]][aSA[11]][aSA[12]][aSA[13]] = newValue
    }
    else if(aSA.length === 14)
    {
        return originalObject[aSA[0]][aSA[1]][aSA[2]][aSA[3]][aSA[5]][aSA[6]][aSA[7]][aSA[8]]
        [aSA[9]][aSA[10]][aSA[11]][aSA[12]][aSA[13]][aSA[14]] = newValue
    }
    else if(aSA.length === 15)
    {
        return originalObject[aSA[0]][aSA[1]][aSA[2]][aSA[3]][aSA[5]][aSA[6]][aSA[7]][aSA[8]]
        [aSA[9]][aSA[10]][aSA[11]][aSA[12]][aSA[13]][aSA[14]][aSA[15]] = newValue
    }
    else if(aSA.length === 16)
    {
        return originalObject[aSA[0]][aSA[1]][aSA[2]][aSA[3]][aSA[5]][aSA[6]][aSA[7]][aSA[8]]
        [aSA[9]][aSA[10]][aSA[11]][aSA[12]][aSA[13]][aSA[14]][aSA[15]][aSA[16]] = newValue
    }
    else if(aSA.length === 17)
    {
        return originalObject[aSA[0]][aSA[1]][aSA[2]][aSA[3]][aSA[5]][aSA[6]][aSA[7]][aSA[8]]
        [aSA[9]][aSA[10]][aSA[11]][aSA[12]][aSA[13]][aSA[14]][aSA[15]][aSA[16]][aSA[17]] = newValue
    }
    else if(aSA.length === 18)
    {
        return originalObject[aSA[0]][aSA[1]][aSA[2]][aSA[3]][aSA[5]][aSA[6]][aSA[7]][aSA[8]]
        [aSA[9]][aSA[10]][aSA[11]][aSA[12]][aSA[13]][aSA[14]][aSA[15]][aSA[16]][aSA[17]]
        [aSA[18]] = newValue
    }
    else if(aSA.length === 19)
    {
        return originalObject[aSA[0]][aSA[1]][aSA[2]][aSA[3]][aSA[5]][aSA[6]][aSA[7]][aSA[8]]
        [aSA[9]][aSA[10]][aSA[11]][aSA[12]][aSA[13]][aSA[14]][aSA[15]][aSA[16]][aSA[17]]
        [aSA[18]][aSA[19]] = newValue
    }
    else if(aSA.length === 20)
    {
        return originalObject[aSA[0]][aSA[1]][aSA[2]][aSA[3]][aSA[5]][aSA[6]][aSA[7]][aSA[8]]
        [aSA[9]][aSA[10]][aSA[11]][aSA[12]][aSA[13]][aSA[14]][aSA[15]][aSA[16]][aSA[17]]
        [aSA[18]][aSA[19]][aSA[20]] = newValue
    }
    else
    {
        throw new Error('Critical error!')
    }
}

checkTypes.typeToString = function (elem)
{
    try {
        return elem.toString().substring(9, elem.toString().indexOf('('))
    } catch(e) {
        if(e instanceof TypeError)
        return 'Null'
    }
}

checkTypes.stringToType = function(typeString)
{
    if(typeof typeString !== 'string')
        throw new Error('argument must be a string type.')
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

    const supported = typeStringsSupport.filter((supportedType) => supportedType === typeString)
    if(!supported.length) throw new Error('Not a supported type.')
    if(typeString === 'String') return String
    else if(typeString === 'Array') return Array
    else if(typeString === 'Object') return Object
    else if(typeString === 'Number') return Number
    else if(typeString === 'Boolean') return Boolean
    else if(typeString === 'Symbol') return Symbol
    else if(typeString === 'Undefined') return undefined
    else if(typeString === 'Null') return null
    else throw new Error('Couldn\'t return correct type for unknown reason.')
}