Opauth-GitHub
=============
[Opauth][1] strategy for GitHub authentication.

Implemented based on http://developer.github.com/v3/oauth/ using OAuth2.

Opauth is a multi-provider authentication framework for PHP.

Demo: http://opauth.org/#github

Getting started
----------------
1. Install Opauth-GitHub:
   ```bash
   cd path_to_opauth/Strategy
   git clone git://github.com/uzyn/opauth-github.git GitHub
   ```

2. Register a GitHub application at https://github.com/settings/applications/new
   - Enter URL as your application URL (this can be outside of Opauth)
   - Callback URL: enter `http://path_to_opauth/github/oauth2callback`
   
3. Configure Opauth-GitHub strategy with `client_id` and `client_secret`.

4. Direct user to `http://path_to_opauth/github` to authenticate


Strategy configuration
----------------------

Required parameters:

```php
<?php
'GitHub' => array(
	'client_id' => 'YOUR CLIENT ID',
	'client_secret' => 'YOUR CLIENT SECRET'
)
```

Optional parameters:
`scope`, `state`

License
---------
Opauth-GitHub is MIT Licensed  
Copyright © 2012 U-Zyn Chua (http://uzyn.com)

[1]: https://github.com/uzyn/opauth