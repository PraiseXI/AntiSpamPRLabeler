# AntiSpamPRLabeler

This GitHub Action automatically labels and comments on pull requests based on the number of changes. It's designed to help maintainers quickly identify potential spam or small contributions by automatically labeling pull requests as 'Potential Spam' if they contain a small number of changes and commenting for further review.

## Prerequisites

This action requires the `GITHUB_TOKEN` with permission to fetch PRs and add labels and comments. The action uses this token to authenticate API requests, ensuring secure and permissioned interactions with your repository.

### Workflow Permissions

To enable the AntiSpamPRLabeler action to label and comment on pull requests, you must grant it the necessary permissions:

- Go to your repository's **Settings**.
- Click on **Actions** in the sidebar.
- Choose **General**.
- In the **Workflow permissions** section, select **Read and write permissions**.

These steps ensure the action has the access it needs to perform its tasks.

## Usage

To incorporate this action into your workflow, add the following step to your GitHub Actions workflow file (e.g., `.github/workflows/antispam-pr-labeler.yml`):

```yaml
- name: Label and Comment PRs
  uses: PraiseXI/AntiSpamPRLabeler@v1.2.0
  with:
    repo-token: ${{ secrets.GITHUB_TOKEN }}
    max-changes-for-label: '2' #default is 2
    label-message: 'This PR has been automatically labeled as "Potential Spam" due to its size. Please review.' 
    # Optional, default message provided
```
This snippet shows how to configure the action to use the built-in `GITHUB_TOKEN` for API requests and allows for optional parameters to customize the labeling and commenting behavior.
## Inputs

`repo-token`: **Required**. The GitHub token used to authenticate API requests. This should generally be set to **`${{ secrets.GITHUB_TOKEN }}`** to utilize the automatic token GitHub provides.

`max-changes-for-label`: **Optional**. The maximum number of changes a PR can have before being labeled as 'Potential Spam'. Default is 2.

`label-message`: **Optional**. The message to comment on PRs that are labeled as 'Potential Spam'. A default message is provided if not set.

## Outputs
There are no outputs defined for this action. Its primary function is to label and comment on PRs directly.


## Example Workflow
Below is a full example demonstrating how to set up a workflow that uses the AntiSpamPRLabeler action. This workflow triggers on pull request events to label and comment as needed.

```yaml
name: Automate PR Labeling and Commenting

on: [pull_request]

jobs:
  label-and-comment:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v2

    - name: Label and Comment PRs
      uses: PraiseXI/AntiSpamPRLabeler@v1.2.0
      with:
        repo-token: ${{ secrets.GITHUB_TOKEN }}
        max-changes-for-label: '2' # Optional, default is 2
        label-message: 'Custom message for labeled PRs.' 
        # Optional, your custom message here
```
## Contributing
Contributions to the PR Labeler and Commenter Action are welcome! Please submit pull requests or open issues with your suggestions.

## License
Distributed under the MIT License. See [LICENSE](https://github.com/PraiseXI/AntiSpamPRLabeler/blob/main/LICENSE) for more information.
