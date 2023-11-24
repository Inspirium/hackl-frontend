export default function ({ app, store }, inject) {
  const user = {
    wallet(wallets) {
      const fw = wallets.filter((item) => {
        return item.club_id === store.state.club.id
      })
      if (fw) {
        return fw[0]
      }
      return null
    },
  }

  inject('user', user)
}
