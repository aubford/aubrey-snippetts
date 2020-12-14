const atApiKey = "LAGUNMA7N9PK9GNKLKW9KTCULYFQIQGK"

function getAmeritradeData(ticker) {
  const response = URLFetchApp.fetch(
    `https://api.tdameritrade.com/v1/instruments?apikey=${atApiKey}&symbol=${ticker}&projection=fundamental`,
    {
      headers: {
        Authorization: "Bearer " + getAmeritradeService().getAccessToken()
      }
    }
  )
}

function getAmeritradeService() {
  // Create a new service with the given name. The name will be used when
  // persisting the authorized token, so ensure it is unique within the
  // scope of the property store.
  return (
    OAuth2.createService("ameritrade")

      // Set the endpoint URLs, which are the same for all Google services.
      .setAuthorizationBaseUrl(
        "https://auth.tdameritrade.com/auth?response_type=code&redirect_uri=Redirect URI&client_id=Consumer Key%40AMER.OAUTHAP"
      )
      .setTokenUrl("https://api.tdameritrade.com/v1/oauth2/token")

      // Set the client ID and secret, from the Google Developers Console.
      .setClientId(atApiKey)
      .setClientSecret(atApiKey) // might not need this!!!!!!!!!!!!!!!!!

      // Set the name of the callback function in the script referenced
      // above that should be invoked to complete the OAuth flow.
      .setCallbackFunction("authCallback")

      // Set the property store where authorized tokens should be persisted.
      .setPropertyStore(PropertiesService.getUserProperties())

      //      .setParam("grant_type", "authorization_code")  need this!!!!!!!!???????

      // Set the scopes to request (space-separated for Google services).
      //      .setScope('https://www.googleapis.com/auth/drive')

      // Below are Google-specific OAuth2 parameters.

      // Sets the login hint, which will prevent the account chooser screen
      // from being shown to users logged in with multiple accounts.
      //      .setParam('login_hint', Session.getEffectiveUser().getEmail())

      // Requests offline access.
      .setParam("access_type", "offline")
  )

  // Consent prompt is required to ensure a refresh token is always
  // returned when requesting offline access.
  //    .setParam('prompt', 'consent');
}

function ameritradeLogin() {
  const ameritradeService = getAmeritradeService()
  if (!ameritradeService.hasAccess()) {
    const authorizationUrl = ameritradeService.getAuthorizationUrl()
    const template = HtmlService.createTemplate(
      '<a href="<?= authorizationUrl ?>" target="_blank">Authorize</a>. ' +
        "Reopen the sidebar when the authorization is complete."
    )
    template.authorizationUrl = authorizationUrl
    const page = template.evaluate()
    SpreadsheetApp.getUi().showSidebar(page)
  } else {
    return HtmlService.createHtmlOutput("Already Logged in!")
  }
}

function authCallback(request) {
  const driveService = getAmeritradeService()
  const isAuthorized = driveService.handleCallback(request)
  if (isAuthorized) {
    return HtmlService.createHtmlOutput("Success! You can close this tab.")
  } else {
    return HtmlService.createHtmlOutput("Denied. You can close this tab")
  }
}
