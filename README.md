# 🏁 Final Form Calculate

[![NPM Version](https://img.shields.io/npm/v/final-form-calculate.svg?style=flat)](https://www.npmjs.com/package/final-form-calculate)
[![NPM Downloads](https://img.shields.io/npm/dm/final-form-calculate.svg?style=flat)](https://www.npmjs.com/package/final-form-calculate)
[![Build Status](https://travis-ci.org/final-form/final-form-calculate.svg?branch=master)](https://travis-ci.org/final-form/final-form-calculate)
[![codecov.io](https://codecov.io/gh/final-form/final-form-calculate/branch/master/graph/badge.svg)](https://codecov.io/gh/final-form/final-form-calculate)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

Decorator for [🏁 Final Form](https://github.com/final-form/final-form) that
allows you to define calculations that happen between fields, i.e. "When field X
changes, update field Y."

---

## Installation

```bash
npm install --save final-form-calculate
```

or

```bash
yarn add final-form-calculate
```

## Usage

```js
import { createForm, getIn } from 'final-form'
import createDecorator from 'final-form-calculate'

// Create Form
const form = createForm({ onSubmit })

// Create Decorator
const decorator = createDecorator(
  // Calculations:
  {
    field: 'foo', // when the value of foo changes...
    updates: {
      // ...set field "doubleFoo" to twice the value of foo
      doubleFoo: (fooValue, allValues) => fooValue * 2
    }
  },
  {
    field: /items\[\d+\]/, // when a field matching this pattern changes...
    updates: {
      // ...sets field "total" to the sum of all items
      total: (itemValue, allValues) =>
        (allValues.items || []).reduce((sum, value) => sum + value, 0)
    }
  },
  {
    field: /\.timeFrom/, // when a deeper field matching this pattern changes...
    updates: (value, name, allValues) => {
      const toField = name.replace('timeFrom', 'timeTo')
      const toValue = getIn(allValues, toField)
      if (toValue && value > toValue) {
        return {
          [toField]: value
        }
      }

      return {}
    }
  }
)

// Decorate form
const undecorate = decorator(form)

// Use form as normal
```

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

* [Example](#example)
  * [Calculated Fields Example](#calculated-fields-example)
* [API](#api)
  * [`createDecorator: (...calculations: Calculation[]) => Decorator`](#createdecorator-calculations-calculation--decorator)
* [Types](#types)
  * [`Calculation: { field: FieldPattern, updates: Updates }`](#calculation--field-fieldpattern-updates-updates-)
  * [`FieldName: string`](#fieldname-string)
  * [`FieldPattern: FieldName | RegExp`](#fieldpattern-fieldname--regexp)
  * [`Updates: { [FieldName]: (value: any, allValues: Object) => any }`](#updates--fieldname-value-any-allvalues-object--any-)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Example

### [Calculated Fields Example](https://codesandbox.io/s/oq52p6v96y)

Example using
[🏁 React Final Form](https://github.com/final-form/react-final-form#-react-final-form).

## API

### `createDecorator: (...calculations: Calculation[]) => Decorator`

A function that takes a set of calculations and returns a 🏁 Final Form
[`Decorator`](https://github.com/final-form/final-form#decorator-form-formapi--unsubscribe).

## Types

### `Calculation: { field: FieldPattern, updates: Updates }`

A calculation to perform

### `FieldName: string`

### `FieldPattern: FieldName | RegExp`

A pattern to match a field with.

### `Updates: { [FieldName]: (value: any, allValues: Object) => any }`

Updates to make on other fields.
