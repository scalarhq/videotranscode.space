# General Contributing Guidelines

This project design is purpose built for the community to contribute to, so we completely encourage contributions.

The project contains a lot of modular sections, where it is extremely easy to contribute too.

1. [Sections](#modular-sections)
2. [Styling](#styling)

## Modular Section

### No Code Sections

These sections require zero code, just adding configuration to the respective yml files, these configurations still need to follow some requirements but they require not actual code to contribute

1. {@page Codecs}
2. {@page Formats}
3. {@page Workflows}

## Require Code

These sections require code but are heavily abstracted and just require the classes to implement the abstracted functions correctly.

1. {@page Features}
2. {@page Clui UI Components}

## Non Modular Sections

Just because these sections are not modular does not mean we don't encourage contributions, just they are a bit more complicated to understand and contribute towards.

That being said feel free to reach out to our team for any guidance or assistance in contributing to any of these core sections of the codebase.

See more {@page Core}

## Styling

**We use eslint and extend standard and prettier, we expect this styling to be maintained across the codebase.**

All code should pass through this before being submitted, there is a `husky` pre-commit script for the same.
```shell
yarn verify
```

Apart from this, try to follow general good coding practices, minimal ts-ignores or type assigned as any. It is fine if it absolutely required but please explain why it is.
