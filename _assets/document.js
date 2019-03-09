require(['gitbook'], function(gitbook, url) {
  var $document = $(document)
  var $window = $(window)
  /** 
   * 处理左侧栏固定定位
  */
  var BookSideBar = {
    init: function () {
      this.bindMember()
      this.bindEvent()
      this.updateSidebarFixed()
    },
    bindMember: function () {
      this.$container = $('.doc-container')
      this.$sidebar = $('.doc-book__sidebar')
      this.$sidebarFixed = $('.doc-book__sidebar-fixed')
    },
    bindEvent: function () {
      $document.on('scroll', $.proxy(this, '_onDocumentScroll'))
      $window.on('resize', $.proxy(this, '_onWindowResize'))
    },
    _onWindowResize: function (evt) {
      this.updateSidebarFixed()
    },
    _onDocumentScroll: function (evt) {
      this.updateSidebarFixed()
    },
    updateSidebarFixed: function () {
      var top = this.$sidebar.offset().top
      if (top < 0) {
        top = 0
      }
      var height = Math.min($window.height(), this.$container.offset().top + this.$container.outerHeight() - $document.scrollTop()) - top + 'px'
      this.$sidebarFixed.css({
        'top': top,
        'height': height
      })
    }
  }
  /** 
   * 处理文章目录选择
  */
  var BookSummary = {
    init: function () {
      this.bindMember()
      this.bindEvent()
    },
    bindMember: function () {
      this.$summarySelect = $('.doc-book-summary__select')
    },
    bindEvent: function () {
      var me = this
      me.$summarySelect.on('click', function(evt){
        me.setActiveSummarySelect(!me.$summarySelect.hasClass('is-active'))
        evt.stopPropagation()
      })
      $document.on('click', function () {
        me.setActiveSummarySelect(false)
      })
    },
    setActiveSummarySelect: function (isActive) {
      if (isActive) {
        this.$summarySelect.addClass('is-active')
      } else {
        this.$summarySelect.removeClass('is-active')
      }
    }
  }
  /** 
   * 处理文章面包屑
  */
  var BookCrumb = {
    init: function () {
      this.bindMember()
      this.bindEvent()
      this.renderCrumbHtml()
      this.updateCrumbFixed()
    },
    bindMember: function () {
      this.$crumb = null
      this.$crumbWrap = $('.doc-book__crumb')
      this.$content = $('.doc-book__content')
      this.$summaryHrefs = $('.doc-book-summary .doc-book-summary__item .doc-book-summary__handle')
    },
    goToPage: function (url) {
      $('.navigation-next').remove()
      $('<a class="navigation-next" href="'+ url +'"></a>').appendTo($('body'))
      gitbook.navigation.goNext()
    },
    bindEvent: function () {
      this.$crumbWrap.on('click', '.doc-book-link', $.proxy(this, '_onCrumbLinkClick'))
      $document.on('scroll', $.proxy(this, '_onDocumentScroll'))
      $window.on('resize', $.proxy(this, '_onWindowResize'))
    },
    _onCrumbLinkClick: function (evt) {
      this.goToPage($(evt.target).attr('href'))
      evt.preventDefault()
    },
    _onWindowResize: function () {
      this.updateCrumbFixed()
    },
    _onDocumentScroll: function () {
      this.updateCrumbFixed()
    },
    getCrumbUrl: function ($item) {
      var href = ''
      var $firstChild = $item.find('> .doc-book-summary__submenu > .doc-book-summary__item:first')
      if ($firstChild.length) {
        href = $firstChild.find('> .doc-book-summary__handle').attr('href')
        if (!href) {
          href = this.getCrumbUrl($firstChild)
        }
      }
      return href
    },
    getCrumbData () {
      var me = this
      var active = $('.doc-book-summary__item.is-active')
      var result = active.parents('.doc-book-summary__item').map(function(){
        var $this = $(this)
        return {
          type: 'link',
          url: me.getCrumbUrl($this),
          text: $this.find('> .doc-book-summary__handle').text()
        }
      })
      var anchors = this.$content.find('h2').map(function(i, v){
        var $v = $(v)
        return {
          url: $v.attr('id'),
          text: $v.text()
        }
      })
      if (anchors.length) {
        result.push({
          type: 'anchor',
          text: '本页导航',
          items: anchors
        })
      }
      return result
    },
    renderCrumbHtml () {
      var html = '<div class="doc-book-crumb">'
      $.each(this.getCrumbData(), function (i, v) {
        if (v.type === 'link') {
          html += '<a class="doc-book-crumb__item doc-book-link" href="' + v.url + '">' + v.text + '</a>'
          html += '<i class="doc-book-crumb__line"></i>'
        } else if (v.type === 'anchor') {
          html += '<span class="doc-book-crumb__item doc-book-anchor">'
            html += '<span class="doc-book-anchor__handle">'+ v.text +'</span>'
            html += '<ul class="doc-book-anchor__list">'
              $.each(v.items, function(ii, vv) {
                html += '<li class="doc-book-anchor__item">'
                  html += '<a class="doc-book-anchor__item-text" href="#'+ vv.url +'">' + vv.text + '</a>'
                html += '</li>'
              })
            html += '</ul>'
          html += '</span>'
        }
      })
      html += '</div>'
      this.$crumbWrap.html(html)
      this.$crumb = this.$crumbWrap.find('> .doc-book-crumb')
    },
    updateCrumbFixed () {
      if (!this.$crumb) {
        return
      }
      var maxTop = this.$crumbWrap.offset().top
      if ($document.scrollTop() > maxTop) {
        var rect = this.$crumbWrap[0].getBoundingClientRect()
        this.$crumb.css({
          'top': 0,
          'left': rect.left,
          'width': rect.width,
          'position': 'fixed'
        })
      } else {
        this.$crumb.css({
          'top': '',
          'left': '',
          'width': '',
          'position': ''
        })
      }
    }
  }
  BookSideBar.init()
  BookSummary.init()
  BookCrumb.init()
});
