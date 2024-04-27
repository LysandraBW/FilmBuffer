--------------------------------------------------------
--  Ref Constraints for Table STARRING
--------------------------------------------------------

  ALTER TABLE "LBELNAVISWALTERS"."STARRING" ADD FOREIGN KEY ("ACTOR_NCONST")
	  REFERENCES "VOIGTC"."CREWMEMBER" ("NCONST") ENABLE;
  ALTER TABLE "LBELNAVISWALTERS"."STARRING" ADD FOREIGN KEY ("TCONST")
	  REFERENCES "VOIGTC"."MEDIA" ("TCONST") ENABLE;
