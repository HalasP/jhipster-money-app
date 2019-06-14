/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { LiabilityComponentsPage, LiabilityDeleteDialog, LiabilityUpdatePage } from './liability.page-object';

const expect = chai.expect;

describe('Liability e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let liabilityUpdatePage: LiabilityUpdatePage;
  let liabilityComponentsPage: LiabilityComponentsPage;
  let liabilityDeleteDialog: LiabilityDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Liabilities', async () => {
    await navBarPage.goToEntity('liability');
    liabilityComponentsPage = new LiabilityComponentsPage();
    await browser.wait(ec.visibilityOf(liabilityComponentsPage.title), 5000);
    expect(await liabilityComponentsPage.getTitle()).to.eq('jhipsterMoneyApp.liability.home.title');
  });

  it('should load create Liability page', async () => {
    await liabilityComponentsPage.clickOnCreateButton();
    liabilityUpdatePage = new LiabilityUpdatePage();
    expect(await liabilityUpdatePage.getPageTitle()).to.eq('jhipsterMoneyApp.liability.home.createOrEditLabel');
    await liabilityUpdatePage.cancel();
  });

  it('should create and save Liabilities', async () => {
    const nbButtonsBeforeCreate = await liabilityComponentsPage.countDeleteButtons();

    await liabilityComponentsPage.clickOnCreateButton();
    await promise.all([
      liabilityUpdatePage.setDateInput('2000-12-31'),
      liabilityUpdatePage.setNameInput('name'),
      liabilityUpdatePage.setDescriptionInput('description'),
      liabilityUpdatePage.setAmountInput('5'),
      liabilityUpdatePage.moneyUserSelectLastOption()
    ]);
    expect(await liabilityUpdatePage.getDateInput()).to.eq('2000-12-31', 'Expected date value to be equals to 2000-12-31');
    expect(await liabilityUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');
    expect(await liabilityUpdatePage.getDescriptionInput()).to.eq('description', 'Expected Description value to be equals to description');
    expect(await liabilityUpdatePage.getAmountInput()).to.eq('5', 'Expected amount value to be equals to 5');
    await liabilityUpdatePage.save();
    expect(await liabilityUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await liabilityComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Liability', async () => {
    const nbButtonsBeforeDelete = await liabilityComponentsPage.countDeleteButtons();
    await liabilityComponentsPage.clickOnLastDeleteButton();

    liabilityDeleteDialog = new LiabilityDeleteDialog();
    expect(await liabilityDeleteDialog.getDialogTitle()).to.eq('jhipsterMoneyApp.liability.delete.question');
    await liabilityDeleteDialog.clickOnConfirmButton();

    expect(await liabilityComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
