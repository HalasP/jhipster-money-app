import { browser, ExpectedConditions, element, by, ElementFinder } from 'protractor';

export class AssetComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-asset div table .btn-danger'));
  title = element.all(by.css('jhi-asset div h2#page-heading span')).first();

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

export class AssetUpdatePage {
  pageTitle = element(by.id('jhi-asset-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));
  dateInput = element(by.id('field_date'));
  nameInput = element(by.id('field_name'));
  descriptionInput = element(by.id('field_description'));
  amountInput = element(by.id('field_amount'));
  moneyUserSelect = element(by.id('field_moneyUser'));

  async getPageTitle() {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setDateInput(date) {
    await this.dateInput.sendKeys(date);
  }

  async getDateInput() {
    return await this.dateInput.getAttribute('value');
  }

  async setNameInput(name) {
    await this.nameInput.sendKeys(name);
  }

  async getNameInput() {
    return await this.nameInput.getAttribute('value');
  }

  async setDescriptionInput(description) {
    await this.descriptionInput.sendKeys(description);
  }

  async getDescriptionInput() {
    return await this.descriptionInput.getAttribute('value');
  }

  async setAmountInput(amount) {
    await this.amountInput.sendKeys(amount);
  }

  async getAmountInput() {
    return await this.amountInput.getAttribute('value');
  }

  async moneyUserSelectLastOption(timeout?: number) {
    await this.moneyUserSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async moneyUserSelectOption(option) {
    await this.moneyUserSelect.sendKeys(option);
  }

  getMoneyUserSelect(): ElementFinder {
    return this.moneyUserSelect;
  }

  async getMoneyUserSelectedOption() {
    return await this.moneyUserSelect.element(by.css('option:checked')).getText();
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

export class AssetDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-asset-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-asset'));

  async getDialogTitle() {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(timeout?: number) {
    await this.confirmButton.click();
  }
}
