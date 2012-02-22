var duck = require("../");

var testMatcher = function(options) {
    return function(test) {
        var matcher = options.matcher;
        var description = options.description;
        var positives = options.positives;
        var negatives = options.negatives;
        
        test.equal(matcher.describeSelf(), description);
        
        positives.forEach(function(positive) {
            test.same(true, matcher.matches(positive));
            var result = matcher.matchesWithDescription(positive);
            test.same(true, result.matches);
            test.same("", result.description);
        });
        negatives.forEach(function(negative) {
            test.same(false, matcher.matches(negative.value));
            test.same(negative.description, matcher.describeMismatch(negative.value));
            var result = matcher.matchesWithDescription(negative.value);
            test.same(false, result.matches);
            test.same(negative.description, result.description);
        });
        
        test.done();
    };
};

exports.isMatchesPrimitiveValues = testMatcher({
    matcher: duck.is(1),
    description: "1",
    positives: [1],
    negatives: [
        {value: 2, description: "was 2"},
        {value: "1", description: "was '1'"},
        {value: null, description: "was null"}
    ]
});

exports.isMatchesObjectUsingIsEqual = testMatcher({
    matcher: duck.is({}),
    description: "{}",
    positives: [{}],
    negatives: [
        {value: {hair: "none"}, description: "was { hair: 'none' }"}
    ]
});

exports.isDoesNothingToMatchers = testMatcher({
    matcher: duck.is(duck.is(1)),
    description: "1",
    positives: [1],
    negatives: [
        {value: 2, description: "was 2"},
        {value: "1", description: "was '1'"},
        {value: null, description: "was null"}
    ]
});

exports.isObjectMatchesValuesExactly = testMatcher({
    matcher: duck.isObject({
        name: "Bob",
        age: 24
    }),
    description: "{\n    age: 24,\n    name: 'Bob'\n}",
    positives: [{name: "Bob", age: 24}],
    negatives: [
        {value: {name: "Bob"}, description: "missing property: age"},
        {value: {}, description: "missing property: age\nmissing property: name"},
        {value: {name: "bob", age: 24}, description: "name was 'bob'"},
        {value: {name: "Bob", age: 24, hair: "none"}, description: "unexpected property: hair"}
    ]
});

exports.hasPropertiesBehavesAsIsObjectExceptIgnoresUnexpectedValues = testMatcher({
    matcher: duck.hasProperties({
        name: "Bob",
        age: 24
    }),
    description: "object with properties {\n    age: 24,\n    name: 'Bob'\n}",
    positives: [{name: "Bob", age: 24}, {name: "Bob", age: 24, hair: "none"}],
    negatives: [
        {value: {name: "Bob"}, description: "missing property: age"},
        {value: {}, description: "missing property: age\nmissing property: name"},
        {value: {name: "bob", age: 24}, description: "name was 'bob'"}
    ]
});

exports.isArrayMatchesLengthAndIndividualElements = testMatcher({
    matcher: duck.isArray(["apple", "banana"]),
    description: "['apple', 'banana']",
    positives: [["apple", "banana"]],
    negatives: [
        {value: [], description: "was of length 0"},
        {value: ["apple", "banana", "coconut"], description: "was of length 3"},
        {value: ["apple", "coconut",], description: "element at index 1 didn't match:\n    was 'coconut'\n    expected 'banana'"}
    ]
});

exports.isArraySubDescriptionsAreIndented = testMatcher({
    matcher: duck.isArray([duck.isObject({name: "Bob"})]),
    description: "[{\n    name: 'Bob'\n}]",
    positives: [[{name: "Bob"}]],
    negatives: [
        {
            value: [{name: "Jim"}],
            description:
                "element at index 0 didn't match:\n" + 
                "    name was 'Jim'\n" +
                "    expected {\n" +
                "        name: 'Bob'\n" +
                "    }"
        }
    ]
});
