<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Crl;
use App\Models\Trl;
use App\Models\Ocde;
use App\Models\Ods;
use App\Models\Country;
use App\Models\Recognition;
use Illuminate\Support\Facades\Storage;

class RecognitionController extends Controller
{

    public function index()
    {
        $crlOptions = Crl::all();
        $trlOptions = Trl::all();
        $countries = Country::all();
        $recognitions = Recognition::with('ods', 'ocde', 'trl', 'crl')->get();
        $ocdes = Ocde::all();
        $odss = Ods::all();
        return Inertia::render('Recognitions/Index', [
            'recognitions' => $recognitions,
            'crlOptions' => $crlOptions,
            'trlOptions' => $trlOptions,
            'ocdes' => $ocdes,
            'odss' => $odss,
            'countries' => $countries,
        ]);
    }


    public function create()
    {
        $crlOptions = Crl::all();
        $trlOptions = Trl::all();
        $ocdes = Ocde::all();
        $odss = Ods::all();
        $countries = Country::all();
        return Inertia::render('Recognitions/Create', [
            'crlOptions' => $crlOptions,
            'trlOptions' => $trlOptions,
            'ocdes' => $ocdes,
            'odss' => $odss,
            'countries' => $countries,
        ]);
    }


    public function store(Request $request)
    {
        $data = $request->validate([
            'institution' => 'required',
            'name' => 'required',
            'summary' => 'required',
            'start_date' => 'required',
            'end_date' => 'required',
            'status' => 'required',
            'budget' => 'required',
            'link' => 'required|url',
            'others' => 'required',
            'country' => 'required',
            'region' => 'required',
            'crl' => 'required',
            'contact'=> 'required',
            'trl' => 'required',
            'ods' => 'required|array',
            'ocde' => 'required|array',
            'file' => 'file|mimes:pdf,doc,docx',
        ]);
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('uploads', $fileName, 'public');
            $data['file_path'] = $filePath;
        }
        $recognition = Recognition::create($data);
        $recognition->country()->associate($request->input('country'));
        $recognition->trl()->associate($request->input('trl'));
        $recognition->crl()->associate($request->input('crl'));
        $recognition->save();
        if ($request->has('ods')) {
            $recognition->ods()->attach($request->input('ods'));
        }
        if ($request->has('ocde')) {
            $recognition->ocde()->attach($request->input('ocde'));
        }
        return redirect()->back();
    }
    private function getFileLink($filePath)
    {
        return asset(Storage::url($filePath));
    }


    public function show($id)
    {
        $recognition = Recognition::with('ods', 'ocde', 'crl', 'trl', 'country')->find($id);
        if (!$recognition) {
            return response()->json(['message' => 'registro no encontrado'], 404);
        }
        $fileLink = $this->getFileLink($recognition->file_path);
        $recognition->file_path = $fileLink;
        return Inertia::render('Recognitions/Show', [
            'recognition' => $recognition,
        ]);
    }

 
    public function edit($id)
    {
        //
    }

 
    public function update(Request $request, $id)
    {
        //
    }


    public function destroy($id)
    {
        $recognition = Recognition::find($id);
        if (!$recognition) {
            return response()->json(['message' => 'Registro no encontrado'], 404);
        }
        if ($recognition->file_path) {
            Storage::disk('public')->delete($recognition->file_path);
        }
        $recognition->delete();
        
        return Inertia::location(route('recognitions.index'));
    }
}
