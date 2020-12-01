module.exports = {
  title: 'Behavior Server',
  tagline: 'A Simple HTTP mocking and testing server',
  url: 'https://sayjava.github.io',
  baseUrl: '/behavior/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'sayjava', // Usually your GitHub org/user name.
  projectName: 'behavior', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Start',
      logo: {
        alt: 'Behavior Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs/start',
          label: 'Start',
          position: 'left',
        },
        {
          to: 'docs/guide',
          activeBasePath: 'docs/guide',
          label: 'Guide',
          position: 'left',
        },
        {
          to: 'docs/assertions',
          activeBasePath: 'docs/assertions',
          label: 'Assertions',
          position: 'left',
        },
        {
          href: 'https://github.com/sayjava/behavior',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://twitter.com/sayjava',
          label: 'Twitter',
          position: 'right',
        }
      ],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} Behavior, Inc. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/sayjava/behavior/edit/master/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};