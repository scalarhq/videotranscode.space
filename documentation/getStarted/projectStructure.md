# Understanding the Project Structure

1. [Full Structure](#full-structure)
2. [Contributing Files](#contributing)
3. [Source Files](#source-files)

This project is quite dense and has a quite complicated file structure, but for contributing you can ignore most of these files.

Let's run down the structure and which folders are important to focus on while contributing

This is the full project structure, without any build steps or tests, we will briefly run down each folder to talk about what it does
but these are the important folders for [contributing](#contributing)

## Full Structure

```
.
├── codecs
│   └── src
├── formats
│   └── src
├── src
│   ├── clui
│   │   ├── commands
│   │   └── components
│   ├── clui-ui-components
│   ├── components
│   │   ├── dropzone
│   │   ├── progress
│   │   ├── static
│   │   ├── terminal
│   │   └── video
│   ├── features
│   │   └── src
│   ├── store
│   ├── ts
│   └── types
└── workflow
    └── src
```

## Contributing

See more at {@page Contributing Guidelines}

### Outside Src

You might notice a few folders are outside the src folder, these are folders with static files which make up the modular structure of the project.
Here you can easily contribute files without having to dive deep into the project.

#### Codecs

The codecs folder contains all the codecs supported by the project. To add a new codec, a new file will have to be added to the `codecs/src` folder. You can find out more at {@page Codecs}

#### Formats

Similar to codecs folder, formats contains all the formats supported by the project. You can find out more about contributing a format at {@page Formats}

#### Workflows

Workflows are a series of features executed in a specific order, you can create a new workflow by add a file to `workflow/src`. Find out more at {@page Workflows}

### Features

Features are different from the previous three sections as they are not yml configuration files but rather proper classes, you can contribute. ALl the features are located at `src/features/src`
You can find out more about adding new features at {@page Features}

### Clui Ui Elements

Clui UI Elements are the components seen inside the clui, when the users chooses a feature. They are located at `src/clui-ui-components`, learn more about adding your own react-components at {@page Clui UI Components}

## Source Files

### Clui

This folder contains all the code to create the clui, [learn more about the clui here](https://blog.repl.it/clui)

### Components

Contains the react components for the UI/UX outside of the CLUI

### Store

Contains the global store using mobx for all the state management of the project

### TS

Contains all the typescript files responsible for processing the user's request

### Types

Contains all the typescript type definitions
