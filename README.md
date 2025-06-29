# AntiSpamPRLabeler

**Automatically detect and label potential spam pull requests to keep your repository clean and maintainable.**

## 🚨 The Problem

Open source repositories often face challenges with:

- **Spam PRs**: Low-quality pull requests with minimal changes (like single character edits) that clutter your repository
- **Time-consuming manual review**: Maintainers spend valuable time identifying and triaging small, potentially spam contributions
- **Repository noise**: Legitimate contributions get buried under a flood of minimal-effort PRs
- **Inconsistent labeling**: Manual labeling of suspicious PRs is time-consuming and prone to human oversight

**AntiSpamPRLabeler solves this by automatically identifying and labeling pull requests with suspiciously small changes, helping maintainers focus on meaningful contributions.**

## ✨ What This Action Does

This GitHub Action automatically:
- 🏷️ **Labels** pull requests as "Potential Spam" when they contain fewer changes than your specified threshold
- 💬 **Comments** on flagged PRs to notify contributors about the automatic labeling
- ⚡ **Saves time** by instantly identifying PRs that need closer review
- 🔧 **Customizable** thresholds and messages to fit your project's needs

Perfect for maintaining clean, high-quality repositories with minimal manual effort!

## 🚀 Quick Start

### Step 1: Set Up Permissions

First, ensure your repository has the correct permissions:

1. Go to your repository's **Settings** → **Actions** → **General**
2. Under **Workflow permissions**, select **Read and write permissions**
3. Click **Save**

💡 *This allows the action to add labels and comments to pull requests.*

### Step 2: Add to Your Workflow

Create or update your workflow file (e.g., `.github/workflows/antispam-pr-labeler.yml`):

```yaml
name: Anti-Spam PR Labeler

on: [pull_request]

jobs:
  label-spam-prs:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v2

    - name: Label Potential Spam PRs
      uses: PraiseXI/AntiSpamPRLabeler@v1.2.0
      with:
        repo-token: ${{ secrets.GITHUB_TOKEN }}
        max-changes-for-label: '2' # Flag PRs with 2 or fewer changes
        label-message: 'This PR has been flagged for review due to minimal changes. Please ensure your contribution adds meaningful value.'
```

That's it! 🎉 Your repository now automatically detects potential spam PRs.

## ⚙️ Configuration Options

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `repo-token` | ✅ **Yes** | - | GitHub token for API access. Use `${{ secrets.GITHUB_TOKEN }}` |
| `max-changes-for-label` | ❌ No | `2` | Maximum number of changes before labeling as spam |
| `label-message` | ❌ No | Default message | Custom comment message for flagged PRs |

### 🎯 Choosing the Right Threshold

- **`1`**: Very strict - flags single-character changes
- **`2`**: Balanced - catches most spam while allowing small legitimate fixes
- **`5`**: Lenient - only flags extremely minimal changes

## 📋 Complete Example

Here's a full workflow with custom configuration:

```yaml
name: Automate PR Quality Control

on: [pull_request]

jobs:
  quality-check:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout Repository
      uses: actions/checkout@v2

    - name: Anti-Spam PR Detection
      uses: PraiseXI/AntiSpamPRLabeler@v1.2.0
      with:
        repo-token: ${{ secrets.GITHUB_TOKEN }}
        max-changes-for-label: '3'
        label-message: |
          🤖 **Automated Review Notice**
          
          This PR has been automatically flagged due to minimal changes. 
          
          If this is a legitimate contribution:
          - Please ensure your changes add meaningful value
          - Consider combining multiple small fixes into a single PR
          - Add a detailed description explaining the necessity of the change
          
          Thank you for contributing! 🙏
```

## 🔍 How It Works

1. **Trigger**: Action runs when a pull request is opened or updated
2. **Analysis**: Counts the total number of changes (additions + deletions)
3. **Decision**: Compares against your configured threshold
4. **Action**: If below threshold → adds "Potential Spam" label + comment
5. **Result**: Maintainers can quickly identify PRs needing closer review

## 📊 See It In Action

Check out a live example in our [test repository](https://github.com/PraiseXI/spam-test-repo/pulls) to see how the action labels and comments on pull requests.

## 🤝 Contributing

We welcome contributions to make AntiSpamPRLabeler even better! 

- 🐛 **Found a bug?** Open an issue
- 💡 **Have an idea?** Start a discussion
- 🔧 **Want to contribute code?** Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ for the open source community**

[⭐ Star this repo](https://github.com/PraiseXI/AntiSpamPRLabeler) • [🐛 Report Issues](https://github.com/PraiseXI/AntiSpamPRLabeler/issues) • [💬 Discussions](https://github.com/PraiseXI/AntiSpamPRLabeler/discussions)

</div>
