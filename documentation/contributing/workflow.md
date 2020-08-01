# Contributing a Workflow

The process of adding a workflow is straightforward and requires no code, but you are likely to be adding a new feature with a new workflow, which is a slightly more involved process. Check {@page Features} to learn more.

1. Create a .yml file in `workflow/src` with the name of your workflow
2. Fill out the following details

```yml
# User Facing Name of your Workflow
name: Compress-Transcode
# User Facing Description of your Workflow
description: Workflow to compress and transcode your videos
# Which features to execute in order
# The features name are not case sensitive
steps:
  - Compress
  - Transcode
```

Find the list of features at {@link Features}

3. Submit Pull Request! Please give a detailed description of your pull request
