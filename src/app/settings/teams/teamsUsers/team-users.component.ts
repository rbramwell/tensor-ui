import { Component, OnInit } from '@angular/core';
import { OrganizationsTableData } from './organizations-data';

@Component({
  selector: 'team-users',
  templateUrl: './team-users.component.html',
})
export class TeamUsersComponent implements OnInit {

  public rows: any[] = [];
  public columns: any[] = [
    {title: 'Name', name: 'name', sort: 'asc', type: 'link'},
    {title: 'Description', name: 'description', sort: '', type: 'text'},
  ];
  public page: number = 1;
  public itemsPerPage: number = 10;
  public maxSize: number = 5;
  public numPages: number = 1;
  public length: number = 0;
  public config: any = {
    paging: true,
    sorting: {columns: this.columns},
    filtering: {filterString: '', columnName: 'name'}
  };

  private data: any[] = OrganizationsTableData;

  public constructor() {
    this.length = this.data.length;
  }

  public changePage(data: any[] = this.data): any[] {
    const start = (this.page - 1) * this.itemsPerPage;
    const end = this.itemsPerPage > -1 ? (start + this.itemsPerPage) : data.length;
    return data.slice(start, end);
  }

  public onChangeTable(column: any): void {
    this.columns.forEach((col: any) => {
      if (col.name !== column.name && col.sort !== false) {
        col.sort = '';
      }
    });

    // let sorting = this.configColumns;

    if (this.config.filtering) {
      Object.assign(this.config.filtering, this.config.filtering);
    }
    if (this.config.sorting) {
      Object.assign(this.config.sorting, this.config.sorting);
    }

    const filteredData = this.changeFilter(this.data, this.config);
    const sortedData = this.changeSort(filteredData, this.config);
    this.rows = this.page && this.config.paging ? this.changePage(sortedData) : sortedData;
    this.length = sortedData.length;

  }

  public changeFilter(data: any, config: any): any {
    if (!config.filtering) {
      return data;
    }

    const regx = new RegExp(this.config.filtering.filterString
      .replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&'), 'i');
    const filteredData: any[] = data.filter((item: any) =>
      item[config.filtering.columnName].match(regx));

    return filteredData;
  }

  public changeSort(data: any, config: any): any {
    if (!config.sorting) {
      return data;
    }

    const columns = this.config.sorting.columns || [];
    let columnName: string = void 0;
    let sort: string = void 0;

    for (const c of columns) {
      if (c.sort !== '' && c.sort !== false) {
        columnName = c.name;
        sort = c.sort;
      }
    }

    if (!columnName) {
      return data;
    }

    // simple sorting
    return data.sort((previous: any, current: any) => {
      if (previous[columnName] > current[columnName]) {
        return sort === 'desc' ? -1 : 1;
      } else if (previous[columnName] < current[columnName]) {
        return sort === 'asc' ? -1 : 1;
      }
      return 0;
    });
  }

  public getData(row: any, propertyName: string): string {
    return propertyName.split('.').reduce((prev: any, curr: string) => prev[curr], row);
  }

  // Username click
  public usernameClick(): void {
    alert('sfsdfs');
  }

  public userDeleteClick(): void {
    alert('sfsdfs');
  }

  public userEditClick(): void {
    alert('team user edit');
  }

  public ngOnInit(): void {
    console.log('hello `TeamUsers` component');

    this.onChangeTable(this.config);
  }
}
