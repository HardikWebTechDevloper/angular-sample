import 'zone.js/dist/zone-node';
require('dotenv').config();
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
const axios = require('axios');

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';
import 'localstorage-polyfill';
import { ServerTransferStateModule } from '@angular/platform-server';
// import {constants} from "./src/constants";
import { decryptData, encrytData, encrytServerData } from './src/helpers/crypto';

(global as any).localStorage = localStorage;

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/dexp/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule,
    })
  );
  server.use(bodyParser.json());
  server.use(cookieParser());
  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',
    })
  );

  server.post('/api/v1/licensee/downloadLicenseeReport', (req, res, next) => {
    const encryptedData = req.body.data;
    // console.log(process, 'process-----');
    // console.log(req, 'process');

    // console.log(encryptedData, 'encryptedData-----');
    const token = `${req.headers.requestedtime}${process.env.secretKey}`;
    let payload, headers;
    if (req.cookies.userToken) {
      headers = { 'Content-Type': 'application/pdf', token: req.cookies.userToken };
    } else {
      headers = { 'Content-Type': 'application/pdf' };
    }
    if (encryptedData) {
      const decryptedData = decryptData(encryptedData, token);
      const encryptServer = encrytServerData(decryptedData, process.env.serverToken);
      payload = encryptServer;
    } else {
      payload = {};
    }
    console.log(payload, 'test req');
    console.log(`${process.env.serverURL}${req.path}`);
    axios
      .post(`${process.env.serverURL}${req.path}`, { data: payload }, { headers: headers })
      .then(function (response: any) {
        console.log(response, 'PDF response-----');
        // res.send(response);
        res.send(response.data);
      })
      .catch(function (error: any) {
        res.send(error);
      });
  });
  server.get('/api/*', (req, res, next) => {
    // const encryptedData = req.body.data;
    // const token = `${req.headers.requestedtime}${process.env.secretKey}`;
    // const decryptedData = decryptData(encryptedData, token);
    // const encryptServer = encrytServerData(decryptedData, process.env.serverToken);
    console.log('--------------sample request', req.cookies);
    let headers;
    if (req.cookies.userToken) {
      headers = { 'Content-Type': 'application/json', token: req.cookies.userToken };
    } else {
      headers = { 'Content-Type': 'application/json' };
    }
    axios
      .get(`${process.env.serverURL}${req.path}`, {
        headers: headers,
      })
      .then(function (response: any) {
        const { status, data } = response;
        console.log('--------------sample response----', data);
        const decryptedServerData = decryptData(data.data, process.env.serverToken);
        // const encryptData = encrytData(decryptedServerData);
        res.json({ status: status, data: JSON.parse(decryptedServerData) });
      })
      .catch(function (error: any) {
        const encryptData = encrytData(error.response.data);
        res.setHeader('requestedTime', encryptData.headers.requestedTime);
        res.json({ status: error.response.status, data: error.response.data });
      });
  });

  server.post('/api/v1/auth/*', (req, res, next) => {
    const encryptedData = req.body.data;
    // console.log(process, 'process-----');
    // console.log(req, 'process');

    console.log(encryptedData, 'encryptedData-----');
    const token = `${req.headers.requestedtime}${process.env.secretKey}`;
    let payload, headers;
    if (encryptedData) {
      const decryptedData = decryptData(encryptedData, token);
      const encryptServer = encrytServerData(decryptedData, process.env.serverToken);
      payload = { data: encryptServer };
    } else {
      payload = { data: {} };
    }
    if (req.cookies.userToken) {
      headers = { 'Content-Type': 'application/json', token: req.cookies.userToken };
    } else {
      headers = { 'Content-Type': 'application/json' };
    }
    console.log(payload, 'test req');
    axios
      .post(`${process.env.serverURL}${req.path}`, payload, { headers: headers })
      .then(function (response: any) {
        const { status, data } = response;
        console.log(data, 'ooooooooooo---');
        console.log(`${process.env.serverURL}${req.path}`, 'oooooooooo---');
        const decryptedServerData = decryptData(data.data, process.env.serverToken);
        const encryptData = encrytData(decryptedServerData);
        if (data.token) res.cookie('userToken', data.token);

        res.setHeader('requestedTime', encryptData.headers.requestedTime);
        res.json({ status: status, data: JSON.parse(decryptedServerData) });
      })
      .catch(function (error: any) {
        console.log(error, 'errr----');
        const encryptData = encrytData(error.response.data);
        res.setHeader('requestedTime', encryptData.headers.requestedTime);
        res.json({ status: error.response.status, data: error.response.data });
      });
  });
  server.post('/api/*', (req, res, next) => {
    const encryptedData = req.body.data;
    // console.log(process, 'process-----');
    // console.log(req, 'process');

    // console.log(encryptedData, 'encryptedData-----');
    const token = `${req.headers.requestedtime}${process.env.secretKey}`;
    let payload, headers;
    if (req.cookies.userToken) {
      headers = { 'Content-Type': 'application/json', token: req.cookies.userToken };
    } else {
      headers = { 'Content-Type': 'application/json' };
    }
    if (encryptedData) {
      const decryptedData = decryptData(encryptedData, token);
      const encryptServer = encrytServerData(decryptedData, process.env.serverToken);
      payload = encryptServer;
    } else {
      payload = {};
    }
    console.log(payload, 'test req');
    console.log(`${process.env.serverURL}${req.path}`);
    axios
      .post(`${process.env.serverURL}${req.path}`, { data: payload }, { headers: headers })
      .then(function (response: any) {
        const { status, data } = response;
        const decryptedServerData = decryptData(data.data, process.env.serverToken);
        // console.log(JSON.parse(decryptedServerData), 'hhhhh');
        res.json({ status: status, data: JSON.parse(decryptedServerData) });
      })
      .catch(function (error: any) {
        const encryptData = encrytData(error.response.data);
        res.setHeader('requestedTime', encryptData.headers.requestedTime);
        res.json({ status: error.response.status, data: error.response.data });
      });
  });
  server.put('/api/*', (req, res, next) => {
    const encryptedData = req.body.data;
    // console.log(process, 'process-----');
    // console.log(req, 'process');
    const token = `${req.headers.requestedtime}${process.env.secretKey}`;
    const decryptedData = decryptData(encryptedData, token);
    const encryptServer = encrytServerData(decryptedData, process.env.serverToken);
    console.log(req.cookies.userToken, 'req.cookies.userToken');
    axios
      .put(
        `${process.env.serverURL}${req.path}`,
        { data: encryptServer },
        { headers: { 'Content-Type': 'application/json', token: req.cookies.userToken } }
      )
      .then(function (response: any) {
        const { status, data } = response;
        console.log(data, 'kkkk');
        const decryptedServerData = decryptData(data.data, process.env.serverToken);
        const encryptData = encrytData(decryptedServerData);
        res.json({ status: status, data: decryptedServerData });
      })
      .catch(function (error: any) {
        const encryptData = encrytData(error.response.data);
        res.setHeader('requestedTime', encryptData.headers.requestedTime);
        res.json({ status: error.response.status, data: error.response.data });
      });
  });
  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
}

function run(): void {
  const port = process.env.PORT || 6001;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
