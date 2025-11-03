import Station from '../models/station.model.js';

export const createStation = async (req, res) => {
  try {
    const { stationID } = req.body;
    if (!stationID) {
      return res.status(400).json({ message: 'stationID is required' });
    }

    const station = await Station.create(req.body);
    return res.status(201).json({ message: 'Station created', data: station });
  } catch (err) {
    console.log("Error in Log In controller", error.message);
    res.status(500).json({ message: error.message });
  }
};


export const getStations = async (req, res) => {
  try {
    const {
      chuan_doan,
      co_quan,
      trieu_chung,
      do_kho,
      doi_tuong,
      do_tuoi,
      stationID    // ✅ added
    } = req.query;

    const query = {};

    if (stationID) query.stationID = stationID;  // ✅ filter by ID

    if (chuan_doan) query['metadata.chuan_doan'] = { $regex: chuan_doan, $options: 'i' };
    if (co_quan) query['metadata.co_quan'] = { $regex: co_quan, $options: 'i' };
    if (trieu_chung) query['metadata.trieu_chung'] = { $regex: trieu_chung, $options: 'i' };
    if (do_kho) query['metadata.do_kho'] = do_kho;
    if (doi_tuong) query['metadata.doi_tuong'] = doi_tuong;

    if (do_tuoi) {
      const [min, max] = do_tuoi.split(',').map(Number);
      query['benh_an_tinh_huong.thong_tin_benh_nhan.tuoi'] = { $gte: min, $lte: max };
    }

    const stations = await Station.find(query);
    res.status(200).json({ message: 'Fetched stations', count: stations.length, data: stations });
  } catch (error) {
    console.error('Error fetching stations:', error.message);
    res.status(500).json({ message: 'Server error while fetching stations' });
  }
};

