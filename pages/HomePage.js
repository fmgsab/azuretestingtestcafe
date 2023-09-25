class ContentsPage {
  constructor() {
    this.locStoryBookIFrame = Selector('#storybook-preview-iframe');
    this.locItemSubTypeComBox = Selector(`div[id='fields-itemSubtype'] input[role='combobox']`);
  }

  async ContentType(contentType) {
    await t
      .switchToIframe(this.locStoryBookIFrame())
      .click(this.locItemSubTypeComBox())
      .typeText(this.locItemSubTypeComBox, contentType)
      .click();
  }
}

export default new ContentsPage();
