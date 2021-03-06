import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California',
  'Colorado', 'Connecticut', 'Delaware', 'District Of Columbia',
  'Federated States Of Micronesia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois',
  'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Marshall Islands', 'Maryland',
  'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska',
  'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina',
  'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau',
  'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming'];

@Component({
  selector: 'user-add',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-add.component.html'
})
export class UserAddComponent implements OnInit {
  public model: any;
  public search = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .distinctUntilChanged()
      .map((term) => term.length < 2 ? []
        : states.filter((v) => new RegExp(term, 'gi').test(v)).splice(0, 10))

  public ngOnInit(): void {
    console.log('hello `UserAdd` component');
  }
}
