import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(text: string, highlightedWords: string[]): SafeHtml {
    const regex = new RegExp(`(${highlightedWords.join('|')})`, 'gi');
    const highlightedText = text.replace(regex, '<span style="color: #5971f6; font-weight: bold">$&</span>');
    return this.sanitizer.bypassSecurityTrustHtml(highlightedText);
  }
}
