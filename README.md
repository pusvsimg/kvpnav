# WebNav Hub

WebNav Hub is a clean, customizable website navigation page built on Cloudflare Pages. It allows users to easily manage and access frequently used website links, with online editing capabilities.

## Features

- Responsive design, adapts to various device screen sizes
- Categorized display of website links for quick lookup
- Support for online adding and editing links
- Password-protected editing functionality
- Uses Font Awesome 6.4.2 icons to beautify link display
- Based on Cloudflare Pages, easy to deploy, fast to access
- Complete mobile optimization experience

### Mobile Optimization Features

- **Responsive Navigation**: Adaptive menu and bottom navigation bar
- **Touch Optimization**: Enhanced touch feedback and interactive experience
- **Pull-to-Refresh**: Support for pull-to-refresh content updates
- **Full-Screen Edit Form**: Mobile-specific editing interface
- **Safe Area Adaptation**: Perfect support for notch screens and full-screen phones
- **Loading Status**: Intuitive loading indicators and prompt messages
- **Offline Support**: Preset links can still be viewed in local mode

## Deployment Steps

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/webnav-hub.git
cd webnav-hub
```

### 2. Create Cloudflare Pages Project

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Go to the "Pages" section
3. Click "Create Project"
4. Select "Connect to Git", then select your GitHub repository
5. In the build settings:
   - Build command: leave empty
   - Build output directory: `/`
6. Click "Save and Deploy"

### 3. Set Up KV Namespace

1. In Cloudflare Dashboard, go to "Workers & Pages" > "KV"
2. Click "Create Namespace"
3. Name it "LINKS_KV"

### 4. Bind KV to Pages Project

1. In Pages project settings, go to "Functions" > "KV Namespace Bindings"
2. Click "Add Binding"
3. Set variable name to "LINKS_KV", select the KV namespace you just created

### 5. Configure Environment Variables

1. In Pages project settings, go to "Environment Variables"
2. Add the following variables:
   - `NODE_VERSION`: Set to `16` or higher version
   - `EDIT_PASSWORD`: Set to your chosen edit password

### 6. Redeploy

In the "Deployments" tab of your Pages project, click "Redeploy" to apply new settings.

## Local Development

You can develop and test this project in a local environment:

1. Open the `index.html` file directly in a browser
   - Note: In local file mode, API functionality is not available, but will automatically use mock data

2. Use a local development server (recommended):

```bash
# Using Python's simple server
python -m http.server 8000

# Or using Node.js's http-server
npx http-server -p 8000
```

## Usage Instructions

### Accessing the Navigation Page

After deployment, you can access the navigation page via the URL provided by Cloudflare Pages or your custom domain.

### Editing Links

1. Click the "Edit Mode" button in the bottom right corner of the page
2. On desktop, the form will display directly on the page; on mobile, the form will slide up from the bottom
3. Fill in the following information in the form:
   - Edit Password: The password you set in the environment variables
   - Category: Select the category to which the link belongs
   - Title: The name displayed for the link
   - URL: The complete URL of the website
   - Icon Class Name: Font Awesome 6 icon class name (e.g., `fa-solid fa-globe`)
4. Click the "Save" button to submit changes

### Using Font Awesome 6.4.2 Icons

This project has been updated to use the latest Font Awesome 6.4.2 version. When using icons, note the following changes:

- Solid icon prefix changed from `fas` to `fa-solid`
- Brand icon prefix changed from `fab` to `fa-brands`
- Regular icon prefix changed from `far` to `fa-regular`

For example:

- `fas fa-home` should now be written as `fa-solid fa-home`
- `fab fa-github` should now be written as `fa-brands fa-github`

More icons can be found at [Font Awesome Official Website](https://fontawesome.com/icons).

## Customization

- Modify `index.html` to add or remove categories
- Edit `styles.css` to change page style and color theme
- Add or modify default links in the `getDefaultLinks()` function in `script.js`

## Deleting Newly Added Links

For navigation pages deployed on Cloudflare Pages, newly added links are stored in Cloudflare's KV (Key-Value) storage. To delete these links, follow these steps:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Enter the "Workers & Pages" section
3. Find and click "KV" in the left menu
4. Find your KV namespace (usually named "LINKS_KV")
5. In the KV namespace, you should be able to see all stored key-value pairs
6. Find the key corresponding to the link you want to delete
7. Click the delete button next to the key (usually a trash can icon)
8. Confirm the deletion

Please note that deletion operations are irreversible. Before deleting, make sure you really want to remove the link.

## Performance Optimization

This project has been optimized in the following aspects:

- **Resource Loading Optimization**: Using CDN to load Font Awesome resources
- **Touch Event Optimization**: Using passive event listeners to improve scrolling performance
- **Caching Mechanism**: Providing default data for content display when API is unavailable
- **Loading Status Management**: Providing visual feedback to reduce perceived loading time

## Contributing

Issues and pull requests are welcome to improve this project.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## WebNav Hub (中文版)

WebNav Hub是一个简洁、可自定义的网址导航页面，基于Cloudflare Pages构建。它允许用户轻松管理和访问常用网站链接，并支持在线编辑功能。

## 功能特点

- 响应式设计，适配各种设备屏幕尺寸
- 分类展示网站链接，便于快速查找
- 支持在线添加和编辑链接
- 密码保护的编辑功能
- 使用Font Awesome 6.4.2图标美化链接显示
- 基于Cloudflare Pages，部署简单，访问快速
- 完整的移动端优化体验

### 移动端优化特性

- **响应式导航**：自适应菜单和底部导航栏
- **触摸优化**：增强的触摸反馈和交互体验
- **下拉刷新**：支持下拉刷新更新内容
- **全屏编辑表单**：移动端专用的编辑界面
- **安全区域适配**：完美支持刘海屏和全面屏手机
- **加载状态**：直观的加载指示器和提示消息
- **离线支持**：本地模式下依然可以查看预设链接

## 部署步骤

### 1. 克隆仓库

```bash
git clone https://github.com/yourusername/webnav-hub.git
cd webnav-hub
```

### 2. 创建Cloudflare Pages项目

1. 登录[Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入"Pages"部分
3. 点击"创建项目"
4. 选择"连接到Git"，然后选择您的GitHub仓库
5. 在构建设置中:
   - 构建命令: 留空
   - 构建输出目录: `/`
6. 点击"保存并部署"

### 3. 设置KV命名空间

1. 在Cloudflare Dashboard中，转到"Workers & Pages" > "KV"
2. 点击"创建命名空间"
3. 命名为"LINKS_KV"

### 4. 绑定KV到Pages项目

1. 在Pages项目设置中，转到"Functions" > "KV命名空间绑定"
2. 点击"添加绑定"
3. 变量名称设为"LINKS_KV"，选择刚才创建的KV命名空间

### 5. 配置环境变量

1. 在Pages项目设置中，转到"环境变量"
2. 添加以下变量:
   - `NODE_VERSION`: 设置为`16`或更高版本
   - `EDIT_PASSWORD`: 设置为您选择的编辑密码

### 6. 重新部署

在Pages项目的"部署"选项卡中，点击"重新部署"以应用新的设置。

## 本地开发

你可以在本地环境中开发和测试此项目：

1. 直接在浏览器中打开`index.html`文件
   - 注意：在本地文件模式下，API功能不可用，但会自动使用模拟数据

2. 使用本地开发服务器（推荐）：

```bash
# Using Python's simple server
python -m http.server 8000

# Or using Node.js's http-server
npx http-server -p 8000
```

## 使用说明

### 访问导航页面

部署完成后，您可以通过Cloudflare Pages提供的URL或您设置的自定义域名访问导航页面。

### 编辑链接

1. 点击页面右下角的"编辑模式"按钮
2. 在桌面端，表单将直接显示在页面上；在移动端，表单将从底部滑出
3. 在表单中填写以下信息:
   - 编辑密码: 您在环境变量中设置的密码
   - 类别: 选择链接所属类别
   - 标题: 链接显示的名称
   - URL: 网站的完整URL
   - 图标类名: Font Awesome 6图标类名(如`fa-solid fa-globe`)
4. 点击"保存"按钮提交更改

### 使用Font Awesome 6.4.2图标

本项目已更新使用最新的Font Awesome 6.4.2版本，使用图标时需注意以下变化：

- 实心图标前缀由`fas`变为`fa-solid`
- 品牌图标前缀由`fab`变为`fa-brands`
- 线框图标前缀由`far`变为`fa-regular`

例如：

- `fas fa-home` 现在应写为 `fa-solid fa-home`
- `fab fa-github` 现在应写为 `fa-brands fa-github`

更多图标可在[Font Awesome官网](https://fontawesome.com/icons)查询。

## 自定义

- 修改`index.html`以添加或删除类别
- 编辑`styles.css`以更改页面样式和颜色主题
- 在`script.js`的`getDefaultLinks()`函数里添加或修改默认链接

## 删除新添加的链接

对于部署在Cloudflare Pages上的导航页面，新添加的链接存储在Cloudflare的KV (Key-Value) 存储中。要删除这些链接，请按照以下步骤操作：

1. 访问[Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入"Workers & Pages"部分
3. 在左侧菜单中找到并点击"KV"
4. 找到您的KV命名空间（通常命名为"LINKS_KV"）
5. 在KV命名空间中，您应该能看到所有存储的键值对
6. 找到您想要删除的链接对应的键
7. 点击该键旁边的删除按钮（通常是一个垃圾桶图标）
8. 确认删除操作

请注意，删除操作是不可逆的。在删除之前，请确保您真的想要移除该链接。

## 性能优化

该项目在以下方面进行了性能优化：

- **资源加载优化**：使用CDN加载Font Awesome资源
- **触摸事件优化**：使用passive事件监听器改善滚动性能
- **缓存机制**：提供默认数据以便在API不可用时展示内容
- **加载状态管理**：提供视觉反馈减少感知加载时间

## 贡献

欢迎提交问题和拉取请求来改进这个项目。

## 许可

本项目采用MIT许可证。详情请见[LICENSE](LICENSE)文件。
