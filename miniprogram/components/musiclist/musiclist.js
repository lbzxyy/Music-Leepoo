// components/musiclist/musiclist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    playingId: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(event) {
      const musicid = event.currentTarget.dataset.musicid
      this.setData({
        playingId: musicid
      })
    }
  }
})
