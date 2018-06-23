# jtoml

Use the [`json`](https://www.npmjs.com/package/json) cli to read and query your TOML

## DESCRIPTION 

It works just like [`json`](https://www.npmjs.com/package/json), but with
TOML.  Tries to output as TOML, but falls back to JSON for things that can't
be represented as TOML (bare arrays, values).

In fact, it _literally_ runs `json` under the hood.  It converts TOML to
JSON, feeds that to `json`, then converts the output of `json` back to TOML
and displays it.

## EXAMPLES

```
$ echo 'foo="bar"}' | jtoml
foo = "bar"

$ echo 'foo = [{a=3}, {a=5}]' | jtoml
[[foo]]
a = 3

[[foo]]
a = 5

$ echo 'foo="bar"' | jtoml foo
bar

$ echo 'fred = {age=42}' | jtoml fred.age    # '.' for property access
42

$ echo 'foo = [{a=3}, {a=5}]' | jtoml foo[0] # array access
a = 3

$ echo '[fred]
age = 42' | jtoml fred.age    # '.' for property access
42

$ echo 'age = 10' | jtoml -e 'this.age++'
age = 11

$ echo 'foo = [{a=3}, {a=5}]' | jtoml foo # things that evaluate to arrays are emitted as JSON
[
  {
    "a": 3
  },
  {
    "a": 5
  }
]
```

## DIFFERECNES AND UNSUPPORTED FEATURES

`-f`, `--file` - Because this is a thing wrapper around `json`, if you
specify a file then `json` will load it as, well, JSON, and not TOML.

Streaming mode makes no sense for TOML, there's no way to do an equivalent
of NDJSON, and there's no document separator to spilt on.
