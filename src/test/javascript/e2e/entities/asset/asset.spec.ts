/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { AssetComponentsPage, AssetDeleteDialog, AssetUpdatePage } from './asset.page-object';

const expect = chai.expect;

describe('Asset e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let assetUpdatePage: AssetUpdatePage;
  let assetComponentsPage: AssetComponentsPage;
  let assetDeleteDialog: AssetDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Assets', async () => {
    await navBarPage.goToEntity('asset');
    assetComponentsPage = new AssetComponentsPage();
    await browser.wait(ec.visibilityOf(assetComponentsPage.title), 5000);
    expect(await assetComponentsPage.getTitle()).to.eq('jhipsterMoneyApp.asset.home.title');
  });

  it('should load create Asset page', async () => {
    await assetComponentsPage.clickOnCreateButton();
    assetUpdatePage = new AssetUpdatePage();
    expect(await assetUpdatePage.getPageTitle()).to.eq('jhipsterMoneyApp.asset.home.createOrEditLabel');
    await assetUpdatePage.cancel();
  });

  it('should create and save Assets', async () => {
    const nbButtonsBeforeCreate = await assetComponentsPage.countDeleteButtons();

    await assetComponentsPage.clickOnCreateButton();
    await promise.all([
      assetUpdatePage.setDateInput('2000-12-31'),
      assetUpdatePage.setNameInput('name'),
      assetUpdatePage.setDescriptionInput('description'),
      assetUpdatePage.setAmountInput('5'),
      assetUpdatePage.moneyUserSelectLastOption()
    ]);
    expect(await assetUpdatePage.getDateInput()).to.eq('2000-12-31', 'Expected date value to be equals to 2000-12-31');
    expect(await assetUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');
    expect(await assetUpdatePage.getDescriptionInput()).to.eq('description', 'Expected Description value to be equals to description');
    expect(await assetUpdatePage.getAmountInput()).to.eq('5', 'Expected amount value to be equals to 5');
    await assetUpdatePage.save();
    expect(await assetUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await assetComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Asset', async () => {
    const nbButtonsBeforeDelete = await assetComponentsPage.countDeleteButtons();
    await assetComponentsPage.clickOnLastDeleteButton();

    assetDeleteDialog = new AssetDeleteDialog();
    expect(await assetDeleteDialog.getDialogTitle()).to.eq('jhipsterMoneyApp.asset.delete.question');
    await assetDeleteDialog.clickOnConfirmButton();

    expect(await assetComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
