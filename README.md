# OBSOLETE

This action is no longer maintained. Use [`gh run download`](https://cli.github.com/manual/gh_run_download) instead. 

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

### Current repository (default):
```yaml
steps:
  - uses: actions/checkout@v2

  - uses: alextompkins/download-prior-artifact@v1
    with:
      name: my-artifact-id-123
      path: path/to/artifact
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  - name: Display structure of downloaded files
    run: ls -R
```

### Another repository:

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
For "Another repository" to work you must provide `GITHUB_TOKEN` with a token which has access to the given repo. The default `GITHUB_TOKEN` only has access to the repo it is running in. For reference, here is a link to github's security guide on [#using-encrypted-secrets-in-a-workflow](https://docs.github.com/en/actions/security-guides/encrypted-secrets#using-encrypted-secrets-in-a-workflow) 

### Using optional commitHash filter:

```yaml
steps:
  - uses: actions/checkout@v2

  - uses: alextompkins/download-prior-artifact@v1
    with:
      name: my-artifact-id-123
      path: path/to/artifact
      commitHash: "7b7a14f"
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  - name: Display structure of downloaded files
    run: ls -R
```
The optional commitHash input filters the list of artifacts to ones that were generated for a particular commit hash. This is useful if your generated artifacts have the same name from one build to the next.  
``` ts
artifact.workflow_run?.head_sha?.startsWith(commitHash)
```
NOTE: the filter uses a startsWith to match so the full 40 character commit hash isn't nessasary 
