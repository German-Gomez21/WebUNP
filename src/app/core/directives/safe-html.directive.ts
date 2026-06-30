import { Directive, Input, OnChanges, SimpleChanges, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Directive({
  selector: '[safeHtml]',
  standalone: true
})
export class SafeHtmlDirective implements OnChanges {
  @Input() safeHtml!: string;
  safeContent!: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['safeHtml']) {
      this.safeContent = this.sanitizer.bypassSecurityTrustHtml(this.safeHtml);
    }
  }
}
