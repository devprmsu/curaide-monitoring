"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
// Import icons individually to avoid build errors
import { Heart, Activity } from "lucide-react";