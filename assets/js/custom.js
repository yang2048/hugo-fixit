/**
 * Custom JavaScript for FixIt blog site.
 */
class FixItBlog {
  /**
   * say hello
   * you can define your own functions below
   */
  hello() {
    return this;
  }

  /**
   * initialize
   */
  init() {
    this.hello();
    return this;
  }
}

/**
 * immediate execution
 */
(() => {
  window.fixitBlog = new FixItBlog();
  // it will be executed when the DOM tree is built
  document.addEventListener('DOMContentLoaded', () => {
    window.fixitBlog.init();
  });
})();
