const fs = require('fs');

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
  );

// Create a middleware to check request body 
// if request body does not have name and price property it will be going to error
  exports.checkBody=(req, res, next)=>{
    if (!req.body.name || !req.body.price){
      return res.status(400).json({
        status: `fail`,
        message:"Missing name or price"
      })
    }
    next();
  }
exports.getAllTours = (req, res) => {
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  };
  exports.getTour=(req, res) => {
    const id = req.params.id * 1;
    if (id > tours.length) {
      return res.status(404).json({
        status: "fail",
        message: "Invalid ID",
      });
    }
    const tour = tours.find((el) => el.id === id);
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  };
  exports.updateTour=(req,res)=>{
    const id = req.params.id * 1;
    const tourToUpdate = tours.find(el => el.id === id);
    if(!tourToUpdate){
      res.status(404).json({
        status:"fail",
        message: "Invalid ID"
      })
    }
    const index = tours.indexOf(tourToUpdate);
    Object.assign(tourToUpdate,req.body);
    tours(index) = tourToUpdate;
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours),(err)=>{
      res.status(200).json({
        status: "success",
        data:{
          tour:tourToUpdate
        }
      })
    })
  }
  exports.createTour= (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour);
    fs.writeFile(
      `${__dirname}/dev-data/data/tours-simple.json`,
      JSON.stringify(tours),
      (err) => {
        res.status(201).json({
          status: "success",
          data: {
            tour: newTour,
          },
        });
      }
    );
  };
  exports.deleteTour=(req,res)=>{
    if(req.params.id *1 > tours.length){
      return res.status(404).json({
        status: "fail",
        message: "Invalid ID"
      })
    }
    const id = req.params.id * 1;
    const tourToDelete= tours.find(el=> el.id === id);
    const index = tours.indexOf(tourToDelete);
    tours.splice(index,1)
  
    res.status(204).json({
      status:"succcess",
      data: null
    })
  }