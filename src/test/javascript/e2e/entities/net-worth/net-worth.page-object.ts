import { browser, ExpectedConditions, element, by, ElementFinder } from 'protractor';

export class NetWorthComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-net-worth div table .btn-danger'));
  title = element.all(by.css('jhi-net-worth div h2#page-heading span')).first();

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

export class NetWorthUpdatePage {
  pageTitle = element(by.id('jhi-net-worth-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));
  dateInput = element(by.id('field_date'));
  liabilitiesAmountInput = element(by.id('field_liabilitiesAmount'));
  assetsAmountInput = element(by.id('field_assetsAmount'));
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

  async setLiabilitiesAmountInput(liabilitiesAmount) {
    await this.liabilitiesAmountInput.sendKeys(liabilitiesAmount);
  }

  async getLiabilitiesAmountInput() {
    return await this.liabilitiesAmountInput.getAttribute('value');
  }

  async setAssetsAmountInput(assetsAmount) {
    await this.assetsAmountInput.sendKeys(assetsAmount);
  }

  async getAssetsAmountInput() {
    return await this.assetsAmountInput.getAttribute('value');
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

export class NetWorthDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-netWorth-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-netWorth'));

  async getDialogTitle() {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(timeout?: number) {
    await this.confirmButton.click();
  }
}
