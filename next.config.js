module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/some-other-page',
        permanent: true,
      },
    ]
  },
}