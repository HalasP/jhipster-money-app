import { browser, ExpectedConditions, element, by, ElementFinder } from 'protractor';

export class MoneyUserComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-money-user div table .btn-danger'));
  title = element.all(by.css('jhi-money-user div h2#page-heading span')).first();

  async clickOnCreateButton(timeout?: number) {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(timeout?: number) {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons() {
    return this.deleteButtons.count();
  }

  async getTitle() {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class MoneyUserUpdatePage {
  pageTitle = element(by.id('jhi-money-user-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));
  ownerSelect = element(by.id('field_owner'));

  async getPageTitle() {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async ownerSelectLastOption(timeout?: number) {
    await this.ownerSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async ownerSelectOption(option) {
    await this.ownerSelect.sendKeys(option);
  }

  getOwnerSelect(): ElementFinder {
    return this.ownerSelect;
  }

  async getOwnerSelectedOption() {
    return await this.ownerSelect.element(by.css('option:checked')).getText();
  }

  async save(timeout?: number) {
    await this.saveButton.click();
  }

  async cancel(timeout?: number) {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class MoneyUserDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-moneyUser-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-moneyUser'));

  async getDialogTitle() {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(timeout?: number) {
    await this.confirmButton.click();
  }
}
