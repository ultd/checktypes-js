declare namespace checkTypes {
  interface CheckTypesError {
    propertyName: string
    expectedType: string
    receivedType: string
    required: boolean
  }
  function getType(
    element: string | number | boolean | symbol | Array<any> | object
  ): string
  function $required(keys: string[]): string[]
  function setVal(
    passedObjectOrArray: object | Array<any>,
    accessorString: string,
    newValue: string | number | boolean | symbol | Array<any> | object,
    depth: number
  ): string | number | boolean | symbol | Array<any> | object
  function getVal(
    passedObjectOrArray: object | Array<any>,
    accessorString: string,
    depth: number
  ): string | number | boolean | symbol | Array<any> | object
  function typeToString(type: Function): string
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
  function propsFromString(accessorString: string): string[]
}

declare function checkTypes(
  passedItem: string | number | boolean | symbol | any[] | object | null,
  passedType: Function | Array<any> | object,
  callback?: Function
): [
  Array<checkTypes.CheckTypesError> | null,
  string | number | boolean | symbol | Array<any> | object | any
]

export = checkTypes
