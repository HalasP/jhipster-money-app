/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { NetWorthComponentsPage, NetWorthDeleteDialog, NetWorthUpdatePage } from './net-worth.page-object';

const expect = chai.expect;

describe('NetWorth e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let netWorthUpdatePage: NetWorthUpdatePage;
  let netWorthComponentsPage: NetWorthComponentsPage;
  let netWorthDeleteDialog: NetWorthDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load NetWorths', async () => {
    await navBarPage.goToEntity('net-worth');
    netWorthComponentsPage = new NetWorthComponentsPage();
    await browser.wait(ec.visibilityOf(netWorthComponentsPage.title), 5000);
    expect(await netWorthComponentsPage.getTitle()).to.eq('jhipsterMoneyApp.netWorth.home.title');
  });

  it('should load create NetWorth page', async () => {
    await netWorthComponentsPage.clickOnCreateButton();
    netWorthUpdatePage = new NetWorthUpdatePage();
    expect(await netWorthUpdatePage.getPageTitle()).to.eq('jhipsterMoneyApp.netWorth.home.createOrEditLabel');
    await netWorthUpdatePage.cancel();
  });

  it('should create and save NetWorths', async () => {
    const nbButtonsBeforeCreate = await netWorthComponentsPage.countDeleteButtons();

    await netWorthComponentsPage.clickOnCreateButton();
    await promise.all([
      netWorthUpdatePage.setDateInput('2000-12-31'),
      netWorthUpdatePage.setLiabilitiesAmountInput('5'),
      netWorthUpdatePage.setAssetsAmountInput('5'),
      netWorthUpdatePage.moneyUserSelectLastOption()
    ]);
    expect(await netWorthUpdatePage.getDateInput()).to.eq('2000-12-31', 'Expected date value to be equals to 2000-12-31');
    expect(await netWorthUpdatePage.getLiabilitiesAmountInput()).to.eq('5', 'Expected liabilitiesAmount value to be equals to 5');
    expect(await netWorthUpdatePage.getAssetsAmountInput()).to.eq('5', 'Expected assetsAmount value to be equals to 5');
    await netWorthUpdatePage.save();
    expect(await netWorthUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await netWorthComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last NetWorth', async () => {
    const nbButtonsBeforeDelete = await netWorthComponentsPage.countDeleteButtons();
    await netWorthComponentsPage.clickOnLastDeleteButton();

    netWorthDeleteDialog = new NetWorthDeleteDialog();
    expect(await netWorthDeleteDialog.getDialogTitle()).to.eq('jhipsterMoneyApp.netWorth.delete.question');
    await netWorthDeleteDialog.clickOnConfirmButton();

    expect(await netWorthComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
