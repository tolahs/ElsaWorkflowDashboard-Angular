import { Component, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

import axios from 'axios';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpRequest } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'ElsaWorkflowDashboard-Angularv12';

  isAuthenticated = false;
  constructor(
    public oidcSecurityService: OidcSecurityService,
    private route: ActivatedRoute,
    private authPl: Router
  ) {}
  ngOnInit() {
    //   const elsaStudioRoot = new  ElsaStudioRoot();
    //   elsaStudioRoot.addEventListener('initializing', e => {
    //     const elsaStudio = e;
    //     // elsaStudio.pluginManager.registerPlugin(this.authPl);
    // });

    // axios.interceptors.request.use(
    //   (config) => {
    //     config.headers['Authorization'] = `Bearer ${localStorage.getItem(
    //       'access_token'
    //     )}`;
    //     return config;
    //   },
    //   (error) => {
    //     return Promise.reject(error);
    //   }
    // );

    this.route.fragment.subscribe((fragment) => {
      const myParamValue = fragment;
      if (fragment) {
        const token = fragment.split('&')[0];
        if (token.startsWith('access_token=')) {
          localStorage.setItem(
            'access_token',
            token.replace('access_token=', '')
          );
        }
      }
    });
    this.oidcSecurityService.isAuthenticated$.subscribe(
      ({ isAuthenticated }) => {
        this.isAuthenticated = isAuthenticated;

        // console.warn('authenticated: ', isAuthenticated);
      }
    );
  }
  login() {
    this.oidcSecurityService.authorize();
  }
  initializing(event: any) {
    const elsaStudio = event.detail;
    elsaStudio.pluginManager.registerPlugin(async (params: any) => {
      params.eventBus.on('http-client-created', (e:any) => {
        // Register Axios middleware.
        debugger;
        e.service.register({
            onRequest(request:any) {
                request.headers = { 'Authorization':  `Bearer ${localStorage.getItem('access_token')}` }
                return request;
            }
        });
    });
    });
  }
}
