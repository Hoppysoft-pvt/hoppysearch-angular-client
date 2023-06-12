import {
  Component,
  OnInit,
  Input,
} from '@angular/core';
import axios from 'axios';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css'],
})
export class SearchPageComponent implements OnInit {
  @Input() hoppySearchConfig: {
    indexId: string;
    apiKey: string;
    iconURL: string;
    targetURL: string;
    primaryText: string;
    secondaryText: string;
    onTypeSearch: boolean;
  } = {
    indexId: '',
    apiKey: '',
    iconURL: '',
    targetURL: '',
    primaryText: '',
    secondaryText: '',
    onTypeSearch: false,
  };

  throwMandatoryAttributeError(name: any, value: any) {
    if (!value) {
      throw new Error(`${name} is a mandatory attribute for HSSearchPage`);
    }
    console.log(value);
  }
  constructor() {
    console.log(this.hoppySearchConfig.indexId);
  }

  hightlightText(highlightedWords: string[], text: string) {
    const regex = new RegExp(`(${highlightedWords.join('|')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      highlightedWords.includes(part.toLocaleLowerCase())
        ? {
            flag: true,
            part,
          }
        : {
            flag: false,
            part,
          }
    );
  }

  onItemClick(item: string) {
    console.log(`Clicked on item: ${item}`);
    if (this.hoppySearchConfig.onTypeSearch === true) {
      window.open(item, '_blank');
    }
  }

  searchResultDocuments: any = '';
  pagedDocuments: any = '';
  isLoading: boolean = false;
  pageIndex: any = 0;
  pageSize: any = 10;
  pageLength: number = 0;
  resultNotFoundBox: boolean = false;
  serverErrorMassage: boolean = false;

  onPageChange(event: PageEvent, val: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;

    const headers = {
      Authorization: this.hoppySearchConfig.apiKey,
    };
    const URL = val
      ? `https://${this.hoppySearchConfig?.indexId}.hoppysearch.com/v1/search?q=${val}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`
      : `https://${this.hoppySearchConfig?.indexId}.hoppysearch.com/v1/search?pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`;
     axios
     .get(URL, { headers: headers })
     .then((response) => {
      this.pagedDocuments = response.data?.documents;
    })
     .catch((error) => {
       console.error(error);
     });

  }

  async handleSearchJsonData(event: Event, val: any) {
    event.preventDefault();
    this.isLoading = true;
    const URL = val
      ? `https://${this.hoppySearchConfig?.indexId}.hoppysearch.com/v1/search?q=${val}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`
      : `https://${this.hoppySearchConfig?.indexId}.hoppysearch.com/v1/search?pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`;
    const headers = {
      Authorization: this.hoppySearchConfig.apiKey,
    };
    await axios
      .get(URL, { headers: headers })
      .then((response) => {
        this.searchResultDocuments = response.data?.documents;
        if (this.searchResultDocuments.length === 0) {
          this.resultNotFoundBox = true;
        }
        if (this.searchResultDocuments.length !== 0) {
          this.resultNotFoundBox = false;
        }
        this.pagedDocuments = response.data?.documents;
        this.pageLength = response.data?.documents.length;
        this.isLoading = false;
      })
      .catch((error) => {
        this.isLoading = false;
        this.serverErrorMassage = true;
        console.error(error);
      });
  }

  async handleFirstTimeSearchJsonData() {
    this.isLoading = true;
    const URL = `https://${this.hoppySearchConfig.indexId}.hoppysearch.com/v1/search?pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`;
    const headers = {
      Authorization: this.hoppySearchConfig.apiKey,
    };
    await axios
      .get(URL, { headers: headers })
      .then((response) => {
        this.searchResultDocuments = response.data?.documents;
        this.pagedDocuments = response.data?.documents;
        this.pageLength = response.data?.documents.length;
        this.isLoading = false;
      })
      .catch((error) => {
        this.isLoading = false;
        this.serverErrorMassage = true;
        console.error(error);
      });
  }
  ngOnInit() {
    this.handleFirstTimeSearchJsonData();
    this.throwMandatoryAttributeError(
      'indexId',
      this.hoppySearchConfig.indexId
    );
    this.throwMandatoryAttributeError('apiKey', this.hoppySearchConfig.apiKey);
    this.throwMandatoryAttributeError(
      'targetURL',
      this.hoppySearchConfig.targetURL
    );
    this.throwMandatoryAttributeError(
      'primaryText',
      this.hoppySearchConfig.primaryText
    );
  }
}
