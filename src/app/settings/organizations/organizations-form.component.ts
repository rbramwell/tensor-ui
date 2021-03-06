import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Organization } from '../../models/organization.model';
import { BreadcrumbService } from 'ng2-breadcrumb/bundles/components/breadcrumbService';
import { OrganizationService } from '../../services/organization.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventBusService } from '../../services/event-bus.service';
import { NotificationsService } from 'angular2-notifications/dist';
import { TensorGlobals } from '../../lib/globals';

@Component({
  selector: 'organizations-form',
  templateUrl: './organizations-form.component.html',
  providers: [OrganizationService, NotificationsService],
})
export class OrganizationsFormComponent implements OnInit, OnChanges, OnDestroy {

  public model: Organization;

  public organizationForm: FormGroup;

  public formErrors = {
    name: '',
  };

  private validationMessages = {
    name: {
      required: 'Please enter a value.',
    },
  };
  private sub: any;
  private id: string;

  constructor(private organizationService: OrganizationService,
              private breadcrumbService: BreadcrumbService,
              private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private bus: EventBusService,
              private _notification: NotificationsService) {
  }

  public ngOnInit(): void {
    this.sub = this.route.params.subscribe((p) => {
      this.id = p['id'];
      if (this.id) {
        this.organizationService.get(this.id).subscribe((res) => {
            this.model = res;
            this.breadcrumbService.addFriendlyNameForRouteRegex('^/settings/organizations/[a-f\\d]{24}$', this.model.name);
            this.ngOnChanges();
          },
          (err) => {
            console.log(err);
          });
      }
    });

    this.createForm();
  }

  public ngOnChanges(): void {
    this.organizationForm.reset({
      id: this.model.id,
      name: this.model.name,
      description: this.model.description,
    });
  }

  public getValue(elem: string): string {
    return this.organizationForm.get(elem).value;
  }

  public onSubmit(): void {
    this.model = this.prepareSave();
    if (this.model.id) { // update a organization
      this.organizationService.update(this.model)
        .toPromise().then((data: Organization) => {
        this.router.navigate(['/settings/organizations/' + this.model.id]);
        this._notification.success('Success', 'Organization updated');
      }).catch((ex) => {
        this._notification.error('Error', 'Unable to update ' + this.model.name);
      });
    } else { // create a new organization
      this.organizationService.create(this.model)
        .toPromise().then((data: Organization) => {
        this.router.navigate(['/settings/organizations/' + this.model.id]);
        this._notification.success('Success', this.model.name + ' created');
      }).catch((ex) => {
        this._notification.error('Error', 'Unable to create');
      });
    }

    this.bus.dispatch(new Event('organization_modify'));
  }

  public ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private prepareSave(): Organization {
    const formModel = this.organizationForm.value;

    const saveOrganization: Organization = {
      id: formModel.id as string,
      name: formModel.name as string,
      description: formModel.description as string,
    } as Organization;

    return saveOrganization;
  }

  private createForm() {
    this.organizationForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: [''],
    });

    this.organizationForm.valueChanges
      .subscribe((data) => this.onValueChanged(data));

    this.onValueChanged();
  }

  private onValueChanged(data?: any) {
    const form = this.organizationForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
}
