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
