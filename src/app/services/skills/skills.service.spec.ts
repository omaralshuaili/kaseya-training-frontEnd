
import { HttpClient, HttpHandler } from '@angular/common/http';
import { SkillsService } from './skills.service';
import { TestBed } from '@angular/core/testing';

describe('SkillsService', () => {
  let service: SkillsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
providers:[HttpClient,HttpHandler]

    });
    service = TestBed.inject(SkillsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
