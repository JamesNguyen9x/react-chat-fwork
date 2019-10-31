module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'chatFwork',
      externals: {
        react: 'React'
      }
    }
  }
};
