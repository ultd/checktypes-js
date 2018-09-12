# checktypes ![CI status](https://img.shields.io/badge/build-passing-brightgreen.svg)

checktypes is a package to help you check the types of a passed variable. It also allows you to check types of an object using an object scheme or an Array and types of elements within the Array.

## Installation

`$ npm install checktypes --save`

## Introduction

### Sections
 1. [Installation](#installation)
 2. [Usage](#usage)
     - [Objects](#object-with-scheme-type-checking)
        - [simple object no properties type check](#simple-object-with-no-propertiess-type-checked)
        - [with defined required properties](#required-properties-in-scheme)
        - [with all required properties](#require-all-properties-in-scheme)
     - [Arrays](#array-type-checking)
        - [simple array type checking](#array-type-checking)
        - [with element type checking](#array-with-element-type-checking)
     - [Strings](#string-number-boolean-or-symbol-type-checking)
     - [Numbers](#string-number-boolean-or-symbol-type-checking)
     - [Booleans](#string-number-boolean-or-symbol-type-checking)
     - [Symbols](#string-number-boolean-or-symbol-type-checking)
 3. [Helper functions](#helper-functions)
     - [getVal](#getval)
     - [setVal](#setval)
     - [getType](#gettype)
     - [typeToString](#typetostring)
     - [stringToType](#stringtotype)
 4. [Contributing](#contributing)
 5. [License](#license)
 6. [Support](#support)

### Simple Example

```js
const T = require('checktypes')

const aNumber = 33

const [error, numberPassed] = T(aNumber, Number)

if(error)
   console.log(error)
else
   // do stuff eith numberPassed
```

### Callback or return style usage

```js
const T = require('checktypes')

/*  Callback function style  */
T( {Item <String|Number|Boolean|Symbol|Array|Object>},
   {Type <String|Number|Boolean|Symbol|Array|Object>},
   function(error, passedItem){
    if(error){
       // handle error
    } else {
       // do stuff with passedItem
    }
})

// OR

/*  Return value style  */
const [error, passedVariable] = 
T( {Item <String|Number|Boolean|Symbol|Array|Object>},
   {Type <String|Number|Boolean|Symbol|Array|Object>})
if(error){
   // handle error
} else {
   // do stuff with passedVariable
}
```

# Usage

### Object with Scheme type checking
You can define a scheme with types and can be nested with other Objects or Arrays.
```js
const T = require('checktypes')

const personScheme = {
    name: String,
    age: Number,
    isMarried: Boolean,
    children: [{name: String, age: Number}],
    address: {
        street: {
            number: Number,
            name: String,
        },
        city: String,
        state: String,
        country: String
    },
    comments: [String]
} 

const personObject = {
    name: 'Shelby',
    age: 32,
    isMarried: true,
    children: [{name: 'Hannah', age: 3}, {name: 'Billy', age: 6}],
    address: {
        street: {
            number: '123',  // <-- ERROR! String instead of Number
            name: 'Main st.'
        },
        city: 'Boston',
        state: 'MA',
        country: 'USA'
    },
    comments: ['is very nice.', 'has a good head on her shoulders']
}

T(personObject, personScheme, function(errors, passedObject){
    if(errors){
        console.log(errors)
        // [ 
        //   { propertyName: 'address.street.number',
        //     expectedType: 'Number',
        //     recievedType: 'String',
        //     required: false } 
        // ]

        // handle errors...
    } else {
        // do stuff with passedObject...
    }
})
```
#### Simple Object with no properties's type checked

```js
const T = require('checktypes')

const objectToCheck = { 
   username: 'hannah1010',
   password: 'securePass!', 
   comments: ['Hey beautiful', 'You\'re a great human being!']
} 

T(objectToCheck, Object, (errors, passedObject) => {     // or an pass {} instead of Object 
   if(errors) {
      // handle any errors
   } else {
      // do stuff with passedObject
})
```

#### Required properties in scheme: 
You can also specify required fields using `$required : [{String name(s) of properties}]`

```js
const T = require('checktypes')

const scheme = {
   username: String,
   password: String,
   rememberMe: Boolean,
   $required: ['username', 'password', 'rememberMe']
}

const objectToCheck = { 
   username: 'hannah1010',
   password: 'securePass!',    // ERROR! missing 'rememberMe' property
} 

T(objectToCheck, scheme, (errors, passedObject) => {
   if(errors) {
      console.log(errors)
      // [ 
      //   { propertyName: 'rememberMe',
      //     expectedType: 'Boolean',
      //     recievedType: 'None',
      //     required: true } 
      // ]
   } else {
      // do stuff with passedObject
})
```
#### Require all properties in scheme:

You also have the ability to specify all scheme properties as required. Import `$required` from package.

```js
const T = require('checktypes')
const { $required } = T

const scheme = {
   username: String,
   password: String,
   rememberMe: Boolean,
   $required                 // just pass $required
}

const objectToCheck = { 
   password: 'securePass!',
   rememberMe: false         // ERROR! missing 'username' property
} 

T(objectToCheck, scheme, (errors, passedObject) => {
   if(errors) {
      console.log(errors)
      // [ 
      //   { propertyName: 'username',
      //     expectedType: 'String',
      //     recievedType: 'None',
      //     required: true } 
      // ]
   } else {
      // do stuff with passedObject
})
```

### Array type checking
```js
const T = require('checktypes')

const [errors, returnedArray] = T([44, true, 'a sexy string'], Array) // can also pass []

if(errors) {
     // handle errors
} else {
     // do stuff with returnedArray
}
```

### Array with element type checking
```js
const T = require('checktypes')

const [errors, passedArray] = T([44, '545', 11], [Number])

if(errors) {
     console.log(errors)
     // [ 
     //   { propertyName: '1',
     //     expectedType: 'Number',
     //     recievedType: 'String',
     //     required: false } 
     // ]
} else {
     // do stuff with passedArray
}
```

### String, Number, Boolean or Symbol type checking
```js
const T = require('checktypes')

const someString = 55

const [error, passedItem] = T(someString, String)

if(error) {
   console.log(error)
   //  {expectedType: 'String',
   //   recievedType: 'Number',
   //   required: true}
} else {
   // do stuff with passedItem
}
```

When type checking primitive types the error will only be an error Object not an Array of error Objects considering only one property/item being checked.

## Helper Functions

This library provides a few helper functions to help you come up with innovative ways to handle errors. User your imagination!

### getVal()
Use this helper function to get a value within the passed Object or Array using propertyName String. 

```js
getVal({PassedItem Object|Array}, {PropertyName String})
```
#### example: 
```js
const T = require('checktypes')
const { getVal } = T

const scheme = {
   request: {
      headers: [{name: String, value: String}],
      type: String,
      body: String,
      statusCode: Number
   }
}

const requestObject = {
    request: {
        headers: [
            { name: 'Authentication', value: 'Bearer ...' },
            { name: 'Content-Type', value: 'application/json' },
            { name: 'Cache-Control', value: 0 }     // ERROR! value should be String type
        ],
        type: 'POST',
        body: '...',
        statusCode: 200
    }
}

T(requestObject, scheme, function(errors, passedObject){
    if(errors){
        console.log(errors)
        // [ { propertyName: 'request.headers.2.value',
        //     expectedType: 'String',
        //     recievedType: 'Number',
        //     required: false } ]
        const value = getVal(passedObject, errors[0].propertyName)   
        console.log(value)
        // 0
    } else {
        // do stuff with passedObject
    }
})

```

### setVal()

Use this helper function to set a new value within the passed Object or Array using propertyName String. 

```js
setVal({PassedItem Object|Array}, {PropertyName String}, 
       {NewValue String|Number|Boolean|Symbol|Object|Array})
```
#### example: 
```js
const T = require('checktypes')
const { getVal, setVal } = T

const scheme = {
   request: {
      headers: [{name: String, value: String}],
      type: String,
      body: String,
      statusCode: Number
   }
}

const requestObject = {
    request: {
        headers: [
            { name: 'Authentication', value: 'Bearer ...' },
            { name: 'Content-Type', value: 'application/json' },
            { name: 'Cache-Control', value: 0 }     // ERROR! value should be String type
        ],
        type: 'POST',
        body: '...',
        statusCode: 200
    }
}

T(requestObject, scheme, function(errors, passedObject){
    if(errors){
        console.log(errors)
        // [ { propertyName: 'request.headers.2.value',
        //     expectedType: 'String',
        //     recievedType: 'Number',
        //     required: false } ]
        const { propertyName } = errors[0]
        const value = getVal(passedObject, propertyName)   
        console.log(value)
        // 0
        if(!value)
            setVal(passedObject, propertyName, 'no-cache')
        const changedValue = getVal(passedObject, propertyName)
        console.log(changedValue)
        // 'no-cache'
    } else {
        // do stuff with passedObject
    }
})

```

### getType()
Use this helper function to get the type of an item passed to it. 

```js
getType({PassedItem String|Number|Boolean|Symbol|Object|Array|Undefined|Null})
```
#### example: 
```js
const T = require('checktypes')
const { getType } = T

const type = getType({lambaRocks: true})
console.log(type)
//  'Object'

// OR

const type = getType(67)
console.log(type)
//  'Number'
```

### typeToString()
Use this helper function to convert a type to a string. 

```js
typeToString({PassedType String|Number|Boolean|Symbol|Object|Array})
```
#### example: 
```js
const T = require('checktypes')
const { typeToString } = T

const typeAsString = typeToString(Array)

console.log(type)
//  'Array'
```

### stringToType()
Use this helper function to convert a string type to a Javascript type. 

```js
stringToType({TypeString String})
```
#### example: 
```js
const T = require('checktypes')
const { stringToType } = T

const returnedType = stringToType('Object')

console.log(Object === returnedType)
//  true
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Support
Please open ticket, no email.