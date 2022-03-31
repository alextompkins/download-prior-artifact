# GitHub Action: Download Prior Artifact
<p>
  <a href="https://github.com/alextompkins/download-prior-artifact/actions">
    <img alt="download-prior-artifact status" src="https://github.com/alextompkins/download-prior-artifact/workflows/build-test/badge.svg" >
  </a>
</p>

Download an artifact from any prior workflow run of a given repository. 

This action exists because [actions/download-artifact](https://github.com/actions/download-artifact) can only download 
artifacts from within the same workflow run. 

Use [actions/upload-artifact](https://github.com/actions/upload-artifact) as normal to upload artifacts for this action to retrieve. 


## Usage

See [action.yml](https://github.com/alextompkins/download-prior-artifact/blob/main/action.yml)

Current repository (default):
```yaml
steps:
  - uses: actions/checkout@v2

  - uses: alextompkins/download-prior-artifact@v1
    with:
      name: my-artifact-id-123
      path: path/to/artifact

  - name: Display structure of downloaded files
    run: ls -R
```

Another repository:

```yaml
steps:
  - uses: actions/checkout@v2

  - uses: alextompkins/download-prior-artifact@v1
    with:
      repo: actions/upload-artifact
      name: my-artifact-id-123
      path: path/to/artifact
    env:
      GITHUB_TOKEN: {{ secrets.ACTION_GITHUB_TOKEN }}

  - name: Display structure of downloaded files
    run: ls -R
```

For this to work you must provide `GITHUB_TOKEN` with a token which has access to the given repo. The default `GITHUB_TOKEN` only has access to the repo it is running in.
