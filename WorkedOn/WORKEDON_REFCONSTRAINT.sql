--------------------------------------------------------
--  Ref Constraints for Table WORKEDON
--------------------------------------------------------

  ALTER TABLE "LBELNAVISWALTERS"."WORKEDON" ADD FOREIGN KEY ("NCONST")
	  REFERENCES "VOIGTC"."CREWMEMBER" ("NCONST") ENABLE;
  ALTER TABLE "LBELNAVISWALTERS"."WORKEDON" ADD FOREIGN KEY ("TCONST")
	  REFERENCES "VOIGTC"."MEDIA" ("TCONST") ENABLE;
