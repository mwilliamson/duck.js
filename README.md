# duck.js -- rich matchers with helpful messages on match failure

duck.js allows you to perform assertions on complex objects.
When those assertions fail, duck.js will try to produce helpful error messages.
For instance, suppose you want to assert the same property on an array of objects:

```javascript
var duck = require("duck");
var isArray = duck.isArray;
var hasProperties = duck.hasProperties;

var users = fetchUsers();
duck.assertThat(users, isArray([
    hasProperties({name: "Bob"}),
    hasProperties({name: "Jim"}),
]));
```

which might produce an error message like:

```Expected [object with properties {
    name: 'Bob'
}, object with properties {
    name: 'Jim'
}]
but element at index 0 didn't match:
    value of property "name" didn't match:
        was 'Jim'
        expected 'Bob'
    expected object with properties {
        name: 'Bob'
    }
element at index 1 didn't match:
    value of property "name" didn't match:
        was 'Bob'
        expected 'Jim'
    expected object with properties {
        name: 'Jim'
    }```

## API

### duck.assertThat(value, matcher)

Assert that `value` satifies `matcher`.

If `value` satifies `matcher`, return normally, otherwise throw an
AssertionError describing the mismatch.

### Matcher

Each matcher has the following methods:

### matcher.matches(value)

Return `true` if `value` satifies this matcher, false otherwise.

### matcher.describeMismatch(value)

Generate a string describing why `value` doesn't satisfy this matcher.
Behaviour is undefined if `value` actually satisifies the matcher.

### matcher.matchesWithDescription(value)

Equivalent to:

```javascript
var isMatch = this.matches(value);
return {
    matches: isMatch,
    description: isMatch ? "" : this.describeMismatch(value)
};
```

Useful if you're likely to want both the boolean and the mismatch description.

### matcher.describeSelf()

Generate a string describing the matcher.

## Thanks

Thanks to [http://hamcrest.org/](Hamcrest) for inspiration.
