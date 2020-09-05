# Contributing a Clui Component

These are components that can be used inside the clui, and they have a few specific requirements.

## Update State of Store

Every clui component must update the configuration the user chooses in the global store, to do this they much call this method {@link CluiStore.updateConfiguration}

```ts
/**
 * Recursively Finds Correct Config and Updates it with the value
 *
 * Example, User updates config of Compress-Transcode->Transcode->Format->Codec is AVI
 * This method will create {Transcode : {Format : {Codec : {chosenCodec : "AVI"}}}}
 *
 * @param newConfiguration Object of user set configurations
 * @param parents An Array of keys of parents, this will determine where the object is updated
 */
updateConfiguration = (
  newConfiguration: { value: any; [name: string]: any },
  parents: Array<string>
) => {};
```

The value here is expected to be bounded to the value chosen by the user.

An implication of this is that, **every clui component must have a prop of parents** of type `Array<string>` which is not mutated before being passed to this method.

## Rendering Children

As these components are meant to be used in a modular capacity they should have the ability to render children, potentially based on the selected value.

There is no strict enforcement here because depending on the use case this may vary.

## Limited by Space

As these components are meant to render within the CLUI, make sure they fit within that space.
