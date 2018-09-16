declare namespace checkTypes {
  function getType(
    element: String | Number | Boolean | Symbol | Array<any> | Object
  ): String
  function $required(keys: String[]): String[]
  function setType(
    passedObjectOrArray: Object | Array<any>,
    accessorString: String,
    newValue: String | Number | Boolean | Symbol | Array<any> | Object
  ): String | Number | Boolean | Symbol | Array<any> | Object
  function setType(
    passedObjectOrArray: Object | Array<any>,
    accessorString: String
  ): String | Number | Boolean | Symbol | Array<any> | Object
  function typeToString(type: Function): String
  function stringToType(
    typeString:
      | "String"
      | "Array"
      | "Object"
      | "Number"
      | "Boolean"
      | "Symbol"
      | "Null"
      | "Undefined"
  ): Function
}

declare function checkTypes(
  passedItem: String | Number | Boolean | Symbol | Array<any> | Object | null,
  passedType: Function | Array<any> | Object,
  callback?: Function
): [
  Array<Object> | null,
  String | Number | Boolean | Symbol | Array<any> | Object | any
]

export = checkTypes
