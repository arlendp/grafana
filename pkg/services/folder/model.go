package folder

import (
	"strings"
	"time"

	"github.com/grafana/grafana/pkg/models"
)

const (
	GeneralFolderUID     = "general"
	MaxNestedFolderDepth = 8
)

type Folder struct {
	ID          int64
	OrgID       int64
	UID         string
	ParentUID   string
	Title       string
	Description string

	// TODO: is URL relevant for folders?
	URL string

	Created time.Time
	Updated time.Time

	// TODO: are these next three relevant for folders?
	UpdatedBy int64
	CreatedBy int64
	HasACL    bool
}

// NewFolder takes a title and returns a Folder with the Created and Updated
// fields set to the current time.
func NewFolder(title string, description string) *Folder {
	return &Folder{
		Title:       title,
		Description: description,
		Created:     time.Now(),
		Updated:     time.Now(),
	}
}

// TODO: this will be removed when the nested folder service refactoring is complete.
// UpdateDashboardModel updates an existing model from command into model for update.
func (cmd *UpdateFolderCommand) UpdateDashboardModel(dashFolder *models.Dashboard, orgId int64, userId int64) *models.Dashboard {
	dashFolder.OrgId = orgId
	dashFolder.Title = strings.TrimSpace(cmd.Folder.Title)

	if cmd.Folder.UID != "" {
		dashFolder.SetUid(cmd.Folder.UID)
	}

	dashFolder.SetVersion(int(cmd.Folder.OrgID)) // TODO: don't think i refactored this right
	dashFolder.IsFolder = true

	if userId == 0 {
		userId = -1
	}

	dashFolder.UpdatedBy = userId

	return dashFolder
}

// CreateFolderCommand captures the information required by the folder service
// to create a folder.
type CreateFolderCommand struct {
	UID         string `json:"uid"`
	Title       string `json:"title"`
	Description string `json:"description"`
	ParentUID   string `json:"parent_uid"`
}

// UpdateFolderCommand captures the information required by the folder service
// to update a folder. Use Move to update a folder's parent folder.
type UpdateFolderCommand struct {
	Folder         *Folder `json:"folder"` // The extant folder
	NewUID         *string `json:"uid"`
	NewTitle       *string `json:"title"`
	NewDescription *string `json:"description"`

	// TODO: not sure we need overwrite / may want to remove when nested folder service refactoring is complete
	Overwrite bool `json:"overwrite"`
}

// MoveFolderCommand captures the information required by the folder service
// to move a folder.
type MoveFolderCommand struct {
	UID          string `json:"uid"`
	NewParentUID string `json:"new_parent_uid"`
}

// DeleteFolderCommand captures the information required by the folder service
// to delete a folder.
type DeleteFolderCommand struct {
	UID string `json:"uid"`
}

// GetFolderQuery is used for all folder Get requests. Only one of UID, ID, or
// Title should be set; if multilpe fields are set by the caller the dashboard
// service will select the field with the most specificity, in order: ID, UID,
// Title.
type GetFolderQuery struct {
	UID   *string
	ID    *int
	Title *string
}

// GetParentsQuery captures the information required by the folder service to
// return a list of all parent folders of a given folder.
type GetParentsQuery struct {
	UID string
}

// GetTreeCommand captures the information required by the folder service to
// return a list of child folders of the given folder.

type GetTreeQuery struct {
	UID   string
	Depth int64

	// Pagination options
	Limit int64
	Page  int64
}
