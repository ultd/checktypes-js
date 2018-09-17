const checkTypes = require("../index.js")
const {
  $required,
  getVal,
  setVal,
  getType,
  stringToType,
  typeToString,
  propsFromString
} = checkTypes

/*     Number Tests     */

test("Type check for Number with a Number", () => {
  checkTypes(66, Number, err => {
    expect(err).toEqual(null)
  })
})

test("Type check for Number with a Boolean", () => {
  checkTypes(true, Number, err => {
    expect(err).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          expectedType: "Number",
          receivedType: "Boolean",
          required: true
        })
      ])
    )
  })
})

test("Type check for Number with an Object", () => {
  checkTypes({ aNumber: 5 }, Number, err => {
    expect(err).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          expectedType: "Number",
          receivedType: "Object",
          required: true
        })
      ])
    )
  })
})

test("Type check for Number with an Array", () => {
  checkTypes([4, 6], Number, err => {
    expect(err).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          expectedType: "Number",
          receivedType: "Array",
          required: true
        })
      ])
    )
  })
})

test("Type check for Number with a String", () => {
  checkTypes("55", Number, err => {
    expect(err).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          expectedType: "Number",
          receivedType: "String",
          required: true
        })
      ])
    )
  })
})

test("Type check for Number with a Symbol", () => {
  checkTypes(Symbol(5), Number, err => {
    expect(err).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          expectedType: "Number",
          receivedType: "Symbol",
          required: true
        })
      ])
    )
  })
})

/*     String Tests     */

test("Type check for String with a String", () => {
  checkTypes("hello world", String, err => {
    expect(err).toEqual(null)
  })
})

test("Type check for String with a Number", () => {
  checkTypes(66, String, err => {
    expect(err).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          expectedType: "String",
          receivedType: "Number",
          required: true
        })
      ])
    )
  })
})

test("Type check for String with a Boolean", () => {
  checkTypes(false, String, err => {
    expect(err).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          expectedType: "String",
          receivedType: "Boolean",
          required: true
        })
      ])
    )
  })
})

test("Type check for String with an Object", () => {
  checkTypes({ name: "John" }, String, err => {
    expect(err).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          expectedType: "String",
          receivedType: "Object",
          required: true
        })
      ])
    )
  })
})

test("Type check for String with an Array", () => {
  checkTypes(["a string array"], String, err => {
    expect(err).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          expectedType: "String",
          receivedType: "Array",
          required: true
        })
      ])
    )
  })
})

test("Type check for String with a Symbol", () => {
  checkTypes(Symbol("a string"), String, err => {
    expect(err).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          expectedType: "String",
          receivedType: "Symbol",
          required: true
        })
      ])
    )
  })
})

/*     Booelan Tests     */

test("Type check for Boolean with a Boolean", () => {
  checkTypes(true, Boolean, err => {
    expect(err).toEqual(null)
  })
})

test("Type check for Boolean with a Number", () => {
  checkTypes(67, Boolean, err => {
    expect(err).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          expectedType: "Boolean",
          receivedType: "Number",
          required: true
        })
      ])
    )
  })
})

test("Type check for Boolean with a String", () => {
  checkTypes("true", Boolean, err => {
    expect(err).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          expectedType: "Boolean",
          receivedType: "String",
          required: true
        })
      ])
    )
  })
})

test("Type check for Boolean with an Object", () => {
  checkTypes({ success: false }, Boolean, err => {
    expect(err).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          expectedType: "Boolean",
          receivedType: "Object",
          required: true
        })
      ])
    )
  })
})

test("Type check for Boolean with an Array", () => {
  checkTypes([false], Boolean, err => {
    expect(err).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          expectedType: "Boolean",
          receivedType: "Array",
          required: true
        })
      ])
    )
  })
})

test("Type check for Boolean with a Symbol", () => {
  checkTypes(Symbol(false), Boolean, err => {
    expect(err).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          expectedType: "Boolean",
          receivedType: "Symbol",
          required: true
        })
      ])
    )
  })
})

/*     Symbol Tests     */

test("Type check for Symbol with a Symbol", () => {
  checkTypes(Symbol(5), Symbol, err => {
    expect(err).toEqual(null)
  })
})

test("Type check for Symbol with a Number", () => {
  checkTypes(5, Symbol, err => {
    expect(err).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          expectedType: "Symbol",
          receivedType: "Number",
          required: true
        })
      ])
    )
  })
})

test("Type check for Symbol with a Boolean", () => {
  checkTypes(true, Symbol, err => {
    expect(err).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          expectedType: "Symbol",
          receivedType: "Boolean",
          required: true
        })
      ])
    )
  })
})

test("Type check for Symbol with a String", () => {
  checkTypes("a not so good symbol", Symbol, err => {
    expect(err).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          expectedType: "Symbol",
          receivedType: "String",
          required: true
        })
      ])
    )
  })
})

test("Type check for Symbol with an Array", () => {
  checkTypes([Symbol(54)], Symbol, err => {
    expect(err).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          expectedType: "Symbol",
          receivedType: "Array",
          required: true
        })
      ])
    )
  })
})

test("Type check for Symbol with an Object", () => {
  checkTypes({ symbol: Symbol(54) }, Symbol, err => {
    expect(err).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          expectedType: "Symbol",
          receivedType: "Object",
          required: true
        })
      ])
    )
  })
})

/*     Array Type Tests     */

test("Type check for Array with an Array", () => {
  checkTypes(["an", "array"], Array, err => {
    expect(err).toEqual(null)
  })
})

test("Type check for Array with a Number", () => {
  checkTypes(55, Array, err => {
    expect(err).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          expectedType: "Array",
          receivedType: "Number",
          required: true
        })
      ])
    )
  })
})

test("Type check for Array with a String", () => {
  checkTypes("an array", Array, err => {
    expect(err).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          expectedType: "Array",
          receivedType: "String",
          required: true
        })
      ])
    )
  })
})

test("Type check for Array with a Boolean", () => {
  checkTypes(false, Array, err => {
    expect(err).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          expectedType: "Array",
          receivedType: "Boolean",
          required: true
        })
      ])
    )
  })
})

test("Type check for Array with a Symbol", () => {
  checkTypes(Symbol([43]), Array, err => {
    expect(err).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          expectedType: "Array",
          receivedType: "Symbol",
          required: true
        })
      ])
    )
  })
})

test("Type check for Array with an Object", () => {
  checkTypes({ list: [54, 56] }, Array, err => {
    expect(err).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          expectedType: "Array",
          receivedType: "Object",
          required: true
        })
      ])
    )
  })
})

/*     Array Literal Tests     */

test("Type check for Array literal with an Array", () => {
  checkTypes(["an", "literal", "array"], [], err => {
    expect(err).toEqual(null)
  })
})

test("Type check for Array literal with an Array of Numbers", () => {
  checkTypes([54, 65, 65], [Number], err => {
    expect(err).toEqual(null)
  })
})

test("Type check for Array literal with an Array of Strings", () => {
  checkTypes(["john", "adams"], [String], err => {
    expect(err).toEqual(null)
  })
})

test("Type check for Array literal with an Array of Booleans", () => {
  checkTypes([true, false], [Boolean], err => {
    expect(err).toEqual(null)
  })
})

test("Type check for Array literal with an Array of Object instance", () => {
  checkTypes([{ anObject: true }, { name: "john" }], [Object], err => {
    expect(err).toEqual(null)
  })
})

test("Type check for Array literal with an Array of Arrays instance", () => {
  checkTypes([[54, 55], [34, 75]], [Array], err => {
    expect(err).toEqual(null)
  })
})

test("Type check for Array literal with an Array of Arrays with element type instance", () => {
  checkTypes([[54, 55], [34, "75"]], [[Number]], err => {
    expect(err).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          propertyName: "[1][1]",
          expectedType: "Number",
          receivedType: "String",
          required: false
        })
      ])
    )
  })
})

test("Type check for Array literal with an Array of Object instance", () => {
  checkTypes([{ anObject: true }, { name: "john" }], [Object], err => {
    expect(err).toEqual(null)
  })
})

test("Type check for Array literal with an Array of Object literal", () => {
  checkTypes([{ name: "Adam" }, { name: false }], [{ name: String }], err => {
    expect(err).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          propertyName: "[1].name",
          expectedType: "String",
          receivedType: "Boolean",
          required: false
        })
      ])
    )
  })
})

test("Type check for Array literal with an Array of Object with an Array property literal", () => {
  checkTypes(
    [
      { name: "Adam", friends: ["john", "james"] },
      { name: "john", friends: ["Adam", true] }
    ],
    [{ name: String, friends: [String] }],
    err => {
      expect(err).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            propertyName: "[1].friends[1]",
            expectedType: "String",
            receivedType: "Boolean",
            required: false
          })
        ])
      )
    }
  )
})

/*    Object Tests   */

test("Type check for Object with Object instance", () => {
  checkTypes({ anObject: true }, Object, err => {
    expect(err).toEqual(null)
  })
})

test("Type check for Object with a Number", () => {
  checkTypes(65, Object, err => {
    expect(err).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          expectedType: "Object",
          receivedType: "Number",
          required: true
        })
      ])
    )
  })
})

test("Type check for Object with a Boolean", () => {
  checkTypes(true, Object, err => {
    expect(err).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          expectedType: "Object",
          receivedType: "Boolean",
          required: true
        })
      ])
    )
  })
})

test("Type check for Object with a String", () => {
  checkTypes('{ "aJsonObject": true }', Object, err => {
    expect(err).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          expectedType: "Object",
          receivedType: "String",
          required: true
        })
      ])
    )
  })
})

test("Type check for Object with a Symbol", () => {
  checkTypes(Symbol({ anObject: true }), Object, err => {
    expect(err).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          expectedType: "Object",
          receivedType: "Symbol",
          required: true
        })
      ])
    )
  })
})

test("Type check for Object with a Array", () => {
  checkTypes([{ anObject: true }], Object, err => {
    expect(err).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          expectedType: "Object",
          receivedType: "Array",
          required: true
        })
      ])
    )
  })
})

/*   Object Literal Tests   */

test("Type check for Object with Object literal", () => {
  checkTypes({ anObject: true }, {}, err => {
    expect(err).toEqual(null)
  })
})

test("Type check for Object with an Object literal with scheme", () => {
  checkTypes(
    { enabled: true, age: 43, name: 0 },
    { enabled: Boolean, age: Number, name: String },
    err => {
      expect(err).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            propertyName: "name",
            expectedType: "String",
            receivedType: "Number",
            required: false
          })
        ])
      )
    }
  )
})

test("Type check for Object with an Object literal with scheme (required fields)", () => {
  checkTypes(
    { enabled: true, age: 43, name: undefined },
    { enabled: Boolean, age: Number, name: String, $required: ["name"] },
    err => {
      expect(err).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            propertyName: "name",
            expectedType: "String",
            receivedType: "None",
            required: true
          })
        ])
      )
    }
  )
})

test("Type check for Object with an Object literal with scheme (required fields and includes a null)", () => {
  checkTypes(
    { enabled: true, age: 43, name: undefined, address: null },
    { enabled: Boolean, age: Number, name: String, $required: ["name"] },
    err => {
      expect(err).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            propertyName: "name",
            expectedType: "String",
            receivedType: "None",
            required: true
          })
        ])
      )
    }
  )
})

test("Type check for Object with an Object literal with a property Object scheme (all required fields)", () => {
  checkTypes(
    {
      enabled: true,
      age: 43,
      name: "john",
      address: {
        street: "123 Main St",
        city: "Boston",
        zipCode: "01124"
      }
    },
    {
      enabled: Boolean,
      age: Number,
      name: String,
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        $required
      },
      $required: ["name"]
    },
    err => {
      expect(err).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            propertyName: "address.state",
            expectedType: "String",
            receivedType: "None",
            required: true
          })
        ])
      )
    }
  )
})

test("Type check for Object with an Object literal with a property Object scheme with an Array property", () => {
  checkTypes(
    {
      enabled: true,
      age: 43,
      name: "john",
      address: {
        street: "123 Main St",
        city: "Boston",
        zipCode: "01124"
      },
      purchases: [
        { item: "purse", price: 45.0 },
        { item: "jacket", price: "65.00" }
      ]
    },
    {
      enabled: Boolean,
      age: Number,
      name: String,
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        $required
      },
      purchases: [{ item: String, price: Number }],
      $required: ["name"]
    },
    err => {
      expect(err).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            propertyName: "address.state",
            expectedType: "String",
            receivedType: "None",
            required: true
          }),
          expect.objectContaining({
            propertyName: "purchases[1].price",
            expectedType: "Number",
            receivedType: "String",
            required: false
          })
        ])
      )
    }
  )
})

/*   getVal() Tests   */

test("getVal() check for getting correct value from an Object", () => {
  checkTypes(
    {
      enabled: true,
      age: "43",
      name: "john"
    },
    {
      enabled: Boolean,
      age: Number,
      name: String
    },
    (err, passedObject) => {
      expect(err).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            propertyName: "age",
            expectedType: "Number",
            receivedType: "String",
            required: false
          })
        ])
      )

      const value = getVal(passedObject, err[0].propertyName)
      expect(value).toEqual("43")
    }
  )
})

test("getVal() check for getting correct value from an Object within an Object", () => {
  checkTypes(
    {
      enabled: true,
      age: 43,
      name: "john",
      address: {
        street: "123 Main St",
        city: "Boston",
        state: "MA",
        zipCode: 11240
      }
    },
    {
      enabled: Boolean,
      age: Number,
      name: String,
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        $required
      },
      $required: ["name"]
    },
    (err, passedObject) => {
      expect(err).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            propertyName: "address.zipCode",
            expectedType: "String",
            receivedType: "Number",
            required: true
          })
        ])
      )

      const value = getVal(passedObject, err[0].propertyName)
      expect(value).toEqual(11240)
    }
  )
})

test("getVal() check for getting correct value from an Object within an Array within an Object", () => {
  checkTypes(
    {
      enabled: true,
      age: 43,
      name: "john",
      address: {
        street: "123 Main St",
        city: "Boston",
        zipCode: "01124"
      },
      purchases: [
        { item: true, price: 45.0 },
        { item: "jacket", price: "65.00" }
      ]
    },
    {
      enabled: Boolean,
      age: Number,
      name: String,
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        $required
      },
      purchases: [{ item: String, price: Number }],
      $required: ["name"]
    },
    (err, passedObject) => {
      expect(err).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            propertyName: "address.state",
            expectedType: "String",
            receivedType: "None",
            required: true
          }),
          expect.objectContaining({
            propertyName: "purchases[0].item",
            expectedType: "String",
            receivedType: "Boolean",
            required: false
          }),
          expect.objectContaining({
            propertyName: "purchases[1].price",
            expectedType: "Number",
            receivedType: "String",
            required: false
          })
        ])
      )

      const value = getVal(passedObject, err[2].propertyName)
      const value2 = getVal(passedObject, err[1].propertyName)

      expect(value).toEqual("65.00")
      expect(value2).toEqual(true)
    }
  )
})

test("getVal() check for getting correct value from within an Array", () => {
  checkTypes([55, 654, "45"], [Number], (err, passedObject) => {
    expect(err).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          propertyName: "[2]",
          expectedType: "Number",
          receivedType: "String",
          required: false
        })
      ])
    )

    const value = getVal(passedObject, err[0].propertyName)
    expect(value).toEqual("45")
  })
})

test("getVal() check for getting correct value from an Array within an Array", () => {
  checkTypes(
    [[554, 656, 65], [43, 66, "33"]],
    [[Number]],
    (err, passedObject) => {
      expect(err).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            propertyName: "[1][2]",
            expectedType: "Number",
            receivedType: "String",
            required: false
          })
        ])
      )

      const value = getVal(passedObject, err[0].propertyName)
      expect(value).toEqual("33")
    }
  )
})

test("getVal() check for getting correct value from an Object within an Array", () => {
  checkTypes(
    [
      {
        enabled: true,
        age: 55,
        name: "Adam"
      },
      {
        enabled: true,
        age: "43",
        name: "John"
      }
    ],
    [
      {
        enabled: Boolean,
        age: Number,
        name: String,
        $required: ["name", "age"]
      }
    ],
    (err, passedObject) => {
      expect(err).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            propertyName: "[1].age",
            expectedType: "Number",
            receivedType: "String",
            required: true
          })
        ])
      )

      const value = getVal(passedObject, err[0].propertyName)
      expect(value).toEqual("43")
    }
  )
})

test("getVal() check for getting correct value from an Array within an Object within an Array", () => {
  checkTypes(
    [
      {
        enabled: true,
        age: 55,
        name: "Adam",
        friends: ["adam", "hannah"]
      },
      {
        enabled: true,
        age: 43,
        name: "John",
        friends: ["james", 45]
      }
    ],
    [
      {
        enabled: Boolean,
        age: Number,
        name: String,
        friends: [String],
        $required: ["name", "age"]
      }
    ],
    (err, passedObject) => {
      expect(err).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            propertyName: "[1].friends[1]",
            expectedType: "String",
            receivedType: "Number",
            required: false
          })
        ])
      )

      const value = getVal(passedObject, err[0].propertyName)
      expect(value).toEqual(45)
    }
  )
})

/*    setVal() Tests   */

test("setVal() check for setting correct value in an Object", () => {
  checkTypes(
    {
      enabled: true,
      age: "43",
      name: "john"
    },
    {
      enabled: Boolean,
      age: Number,
      name: String
    },
    (err, passedObject) => {
      expect(err).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            propertyName: "age",
            expectedType: "Number",
            receivedType: "String",
            required: false
          })
        ])
      )

      const value = getVal(passedObject, err[0].propertyName)
      expect(value).toEqual("43")

      setVal(passedObject, err[0].propertyName, parseInt(value))
      const changedVal = getVal(passedObject, err[0].propertyName)
      expect(changedVal).toEqual(43)
    }
  )
})

test("SetVal() check for setting correct value in an Object within an Object", () => {
  checkTypes(
    {
      enabled: true,
      age: 43,
      name: "john",
      address: {
        street: "123 Main St",
        city: "Boston",
        state: "MA",
        zipCode: 11240
      }
    },
    {
      enabled: Boolean,
      age: Number,
      name: String,
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        $required
      },
      $required: ["name"]
    },
    (err, passedObject) => {
      expect(err).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            propertyName: "address.zipCode",
            expectedType: "String",
            receivedType: "Number",
            required: true
          })
        ])
      )

      const value = getVal(passedObject, err[0].propertyName)
      expect(value).toEqual(11240)

      setVal(passedObject, err[0].propertyName, value.toString())
      const changedVal = getVal(passedObject, err[0].propertyName)
      expect(changedVal).toEqual("11240")
    }
  )
})

test("SetVal() check for setting correct value in an Object within an Array within an Object", () => {
  checkTypes(
    {
      enabled: true,
      age: 43,
      name: "john",
      address: {
        street: "123 Main St",
        city: "Boston",
        zipCode: "01124"
      },
      purchases: [
        { item: true, price: 45.0 },
        { item: "jacket", price: "65.00" }
      ]
    },
    {
      enabled: Boolean,
      age: Number,
      name: String,
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        $required
      },
      purchases: [{ item: String, price: Number }],
      $required: ["name"]
    },
    (err, passedObject) => {
      expect(err).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            propertyName: "address.state",
            expectedType: "String",
            receivedType: "None",
            required: true
          }),
          expect.objectContaining({
            propertyName: "purchases[0].item",
            expectedType: "String",
            receivedType: "Boolean",
            required: false
          }),
          expect.objectContaining({
            propertyName: "purchases[1].price",
            expectedType: "Number",
            receivedType: "String",
            required: false
          })
        ])
      )

      const value = getVal(passedObject, err[2].propertyName)
      const value2 = getVal(passedObject, err[1].propertyName)

      expect(value).toEqual("65.00")
      expect(value2).toEqual(true)

      setVal(passedObject, err[2].propertyName, parseInt(value))
      const changedVal = getVal(passedObject, err[2].propertyName)
      expect(changedVal).toEqual(65)
    }
  )
})

test("setVal() check for setting correct value within an Array", () => {
  checkTypes([55, 654, "45"], [Number], (err, passedObject) => {
    expect(err).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          propertyName: "[2]",
          expectedType: "Number",
          receivedType: "String",
          required: false
        })
      ])
    )

    const value = getVal(passedObject, err[0].propertyName)
    expect(value).toEqual("45")

    setVal(passedObject, err[0].propertyName, parseInt(value))
    const changedVal = getVal(passedObject, err[0].propertyName)
    expect(changedVal).toEqual(45)
  })
})

test("setVal() check for setting correct value in an Array within an Array", () => {
  checkTypes(
    [[554, 656, 65], [43, 66, "33"]],
    [[Number]],
    (err, passedObject) => {
      expect(err).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            propertyName: "[1][2]",
            expectedType: "Number",
            receivedType: "String",
            required: false
          })
        ])
      )

      const value = getVal(passedObject, err[0].propertyName)
      expect(value).toEqual("33")

      setVal(passedObject, err[0].propertyName, parseInt(value))

      const changedVal = getVal(passedObject, err[0].propertyName)
      expect(changedVal).toEqual(33)
    }
  )
})

test("setVal() check for setting correct value in an Array within an Array", () => {
  checkTypes(
    [[554, 656, 65], [43, 66, "33"]],
    [[Number]],
    (err, passedObject) => {
      expect(err).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            propertyName: "[1][2]",
            expectedType: "Number",
            receivedType: "String",
            required: false
          })
        ])
      )

      const value = getVal(passedObject, err[0].propertyName)
      expect(value).toEqual("33")

      setVal(passedObject, err[0].propertyName, parseInt(value))

      const changedVal = getVal(passedObject, err[0].propertyName)
      expect(changedVal).toEqual(33)
    }
  )
})

test("setVal() check for getting correct value in an Object within an Array", () => {
  checkTypes(
    [
      {
        enabled: true,
        age: 55,
        name: "Adam"
      },
      {
        enabled: true,
        age: "43",
        name: "John"
      }
    ],
    [
      {
        enabled: Boolean,
        age: Number,
        name: String,
        $required: ["name", "age"]
      }
    ],
    (err, passedObject) => {
      expect(err).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            propertyName: "[1].age",
            expectedType: "Number",
            receivedType: "String",
            required: true
          })
        ])
      )

      const value = getVal(passedObject, err[0].propertyName)
      expect(value).toEqual("43")

      setVal(passedObject, err[0].propertyName, parseInt(value))
      const changedVal = getVal(passedObject, err[0].propertyName)
      expect(changedVal).toEqual(43)
    }
  )
})

test("setVal() + getVal() check for setting correct value in an Object within an Array with stepBack setting", () => {
  checkTypes(
    [
      {
        enabled: true,
        age: 55,
        name: "Adam",
        address: {
          street: "123 Main st",
          state: "MA",
          zipCode: 34535
        }
      },
      {
        enabled: true,
        age: 43,
        name: "John",
        address: {
          street: "245 State st",
          state: "CA",
          zipCode: "90210"
        }
      }
    ],
    [
      {
        enabled: Boolean,
        age: Number,
        name: String,
        address: {
          street: String,
          state: String,
          zipCode: Number
        },
        $required: ["name", "age"]
      }
    ],
    (err, passedObject) => {
      expect(err).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            propertyName: "[1].address.zipCode",
            expectedType: "Number",
            receivedType: "String",
            required: false
          })
        ])
      )

      const value = getVal(passedObject, err[0].propertyName, 2)
      expect(value).toEqual(
        expect.objectContaining({
          enabled: true,
          age: 43,
          name: "John",
          address: {
            street: "245 State st",
            state: "CA",
            zipCode: "90210"
          }
        })
      )

      setVal(
        passedObject,
        err[0].propertyName,
        {
          enabled: true,
          age: 43,
          name: "John",
          address: {
            street: "245 State st",
            state: "CA",
            zipCode: 90210
          }
        },
        2
      )

      const changedVal = getVal(passedObject, err[0].propertyName, 1)
      expect(changedVal).toEqual(
        expect.objectContaining({
          street: "245 State st",
          state: "CA",
          zipCode: 90210
        })
      )
    }
  )
})

test("setVal() + getVal() check for setting correct value in a nested Object with stepBack setting", () => {
  checkTypes(
    {
      a: {
        b: {
          c: {
            d: {
              e: {
                val: [true]
              }
            }
          }
        }
      }
    },
    {
      a: {
        b: {
          c: {
            d: {
              e: {
                val: [Number]
              }
            }
          }
        }
      }
    },
    (err, passedObject) => {
      const value = getVal(passedObject, err[0].propertyName, 4)
      expect(value).toEqual(
        expect.objectContaining({
          d: {
            e: {
              val: [true]
            }
          }
        })
      )
      
      const props = propsFromString(err[0].propertyName)
      expect(props.length).toEqual(7)


      const changedValObj = setVal(
        passedObject,
        err[0].propertyName,
        {
          c: {
            d: {
              e: {
                val: [5]
              }
            }
          }
        },
        5
      )

      expect(changedValObj).toEqual(
        expect.objectContaining({
          c: {
            d: {
              e: {
                val: [5]
              }
            }
          }
        })
      )

      const changedVal = getVal(passedObject, err[0].propertyName, 4)
      expect(changedVal).toEqual(
        expect.objectContaining({
          d: {
            e: {
              val: [5]
            }
          }
        })
      )
    }
  )
})

test('getType() returns proper types', () => {
  expect(getType(2)).toEqual('Number')
  expect(getType(true)).toEqual('Boolean')
  expect(getType('a string')).toEqual('String')
  expect(getType([])).toEqual('Array')
  expect(getType({})).toEqual('Object')
  expect(getType(Symbol(34))).toEqual('Symbol')
  expect(getType(null)).toEqual('Null')
  expect(getType(undefined)).toEqual('Undefined')
})


test('stringToType() returns proper types', ()=>{
  expect(stringToType('String')).toEqual(String)
  expect(stringToType('Array')).toEqual(Array)
  expect(stringToType('Object')).toEqual(Object)
  expect(stringToType('Number')).toEqual(Number)
  expect(stringToType('Undefined')).toEqual(undefined)
  expect(stringToType('Null')).toEqual(null)
  expect(stringToType('Symbol')).toEqual(Symbol)
  expect(stringToType('Boolean')).toEqual(Boolean)
})

test('typeToString() returns proper strings', ()=>{
  expect(typeToString(String)).toEqual('String')
  expect(typeToString(Array)).toEqual('Array')
  expect(typeToString(Object)).toEqual('Object')
  expect(typeToString(Number)).toEqual('Number')
  expect(typeToString(null)).toEqual('Null')
  expect(typeToString(undefined)).toEqual('Undefined')
  expect(typeToString(Symbol)).toEqual('Symbol')
  expect(typeToString(Boolean)).toEqual('Boolean')
})

