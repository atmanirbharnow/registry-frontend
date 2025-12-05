// src/app/api/calculate-footprint/route.ts
import { NextRequest } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { app } from '@/lib/admin';

// 🌍 Emission Factors (India-specific where available)
const EMISSION_FACTORS = {
  electricity_kwh: 0.00082,   // tCO2e/kWh (India grid avg - CEA 2023)
  fuel_liters: 0.00268,     // tCO2e/liter (Diesel - IPCC)
  lpg_kg: 0.003,            // tCO2e/kg (Approx)
  water_m3: 0.00034,        // tCO2e/m³ (WBCSD water footprint)
  waste_kg: 0.0012,         // tCO2e/kg (Landfill - IPCC)
};

// 🌱 Initiative Reduction Multipliers (benchmarked)
const INITIATIVE_REDUCTIONS = {
  solar: 0.20,              // 20% energy reduction
  rainwater: 0.10,         // 10% water reduction
  composting: 0.30,        // 30% waste reduction
  ev: 0.15,                // 15% transport/fuel reduction
  tree_plantation: 0.05,   // 5% offset
};

export async function POST(req: NextRequest) {
  try {
    // 🔐 Authenticate user
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const auth = getAuth(app);
    const firestore = getFirestore(app);

    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // 📥 Parse input
    const {
      name,
      sector,
      location,
      email,
      electricity_kwh = 0,
      fuel_liters = 0,
      water_m3 = 0,
      waste_kg = 0,
      initiatives = [] as string[],
    } = await req.json();

    // ✅ Validate
    if (!name || !sector || !email) {
      return Response.json({ error: 'Missing KYC fields' }, { status: 400 });
    }

    // 📊 Calculate baseline footprint (tCO₂e)
    const baseline = 
      electricity_kwh * EMISSION_FACTORS.electricity_kwh +
      fuel_liters * EMISSION_FACTORS.fuel_liters +
      water_m3 * EMISSION_FACTORS.water_m3 +
      waste_kg * EMISSION_FACTORS.waste_kg;

    // 🌿 Apply initiative reductions
    let reduction = 0;
    if (initiatives.includes('solar')) reduction += INITIATIVE_REDUCTIONS.solar;
    if (initiatives.includes('rainwater')) reduction += INITIATIVE_REDUCTIONS.rainwater;
    if (initiatives.includes('composting')) reduction += INITIATIVE_REDUCTIONS.composting;
    if (initiatives.includes('ev')) reduction += INITIATIVE_REDUCTIONS.ev;
    if (initiatives.includes('tree_plantation')) reduction += INITIATIVE_REDUCTIONS.tree_plantation;

    const adjusted = Math.max(0, baseline * (1 - reduction));
    const footprint = parseFloat(adjusted.toFixed(1)); // e.g., 6.0

    // 🆔 Generate registry ID
    const registryId = `ECF-2025-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // 💾 Save to Firestore
    const reportRef = await firestore.collection('footprintReports').add({
      registryId,
      userId,
      kyc: { name, sector, location, email },
      consumption: { electricity_kwh, fuel_liters, water_m3, waste_kg },
      initiatives,
      footprint_tco2e: footprint,
      baseline_tco2e: parseFloat(baseline.toFixed(1)),
      year: 2025,
      verified: true, // For MVP, auto-verify
      createdAt: new Date(),
    });

    // ✅ Return success
    return Response.json({
      success: true,
      registryId,
      footprint: footprint,
      reportUrl: `https://registryearthcarbon.org/report/${registryId}`,
    });

  } catch (error: any) {
    console.error('Footprint calculation error:', error);
    return Response.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
