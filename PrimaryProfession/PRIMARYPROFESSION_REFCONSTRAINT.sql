--------------------------------------------------------
--  Ref Constraints for Table PRIMARYPROFESSION
--------------------------------------------------------

  ALTER TABLE "LBELNAVISWALTERS"."PRIMARYPROFESSION" ADD FOREIGN KEY ("NCONST")
	  REFERENCES "VOIGTC"."CREWMEMBER" ("NCONST") ENABLE;
