import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AppConfig } from '../app.config';
import { AnsibleJobTmpl } from '../models/ansible-jobtmpl.model';
import { AnsibleJobTmplResponse } from '../models/ansible-jobtmpl-response.model';

@Injectable()
export class AnsibleJobTmplService {
  private headers: Headers;
  private jobTmplUrl: string;

  constructor(private _http: Http, private config: AppConfig) {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    this.jobTmplUrl = this.config.getConfig('host') + '/v1/job_templates';
  }

  getAll(p?: URLSearchParams): Observable<AnsibleJobTmplResponse> {
    return this._http
      .get(this.jobTmplUrl, new RequestOptions({headers: this.headers, search: p}))
      .map(response => response.json());
  }

  create(tmpl: AnsibleJobTmpl): Observable<AnsibleJobTmpl> {
    return this._http
      .post(this.jobTmplUrl + '/', AnsibleJobTmpl,
        new RequestOptions({headers: this.headers}))
      .map(response => response.json());
  }

  get(id: string): Observable<AnsibleJobTmpl> {
    return this._http
      .get(this.jobTmplUrl + '/' + id, new RequestOptions({headers: this.headers}))
      .map(response => response.json())
  }

  update(tmpl: AnsibleJobTmpl): Observable<AnsibleJobTmpl> {
    return this._http
      .put(this.jobTmplUrl + '/' + tmpl.id, tmpl, new RequestOptions({headers: this.headers}))
      .map(response => response.json());
  }

  delete(id: string) {
    return this._http
      .delete(this.jobTmplUrl + id, new RequestOptions({headers: this.headers}))
  }

  getToken(): string {
    return JSON.parse(localStorage.getItem('_tensor_user')).token;
  }

}
